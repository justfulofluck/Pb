"""
Tests for blog post content serialization fix.

The BlogPostSerializer handles conversion between:
- Database storage: JSONField with list of paragraphs (array)
- API representation: string with paragraphs separated by double newlines

This ensures frontend compatibility while maintaining structured data in the database.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from api.models import BlogPost
from api.serializers import BlogPostSerializer
import json


class BlogPostContentSerializationTests(TestCase):
    """Test suite for blog content field serialization and deserialization."""

    def setUp(self):
        """Set up test client and create a test user."""
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username="admin", email="admin@test.com", password="admin123"
        )
        # For testing protected endpoints
        self.client.force_authenticate(user=self.admin_user)

        # Base blog data
        self.base_blog_data = {
            "post_type": "Recipe",
            "title": "Test Blog Post",
            "excerpt": "This is a test excerpt",
            "image": "https://example.com/image.jpg",
            "date": "2024-01-01",
            "read_time": "5 min read",
            "author": "Test Author",
        }

    def test_create_blog_with_array_content(self):
        """Test creating a blog post with array content directly."""
        data = self.base_blog_data.copy()
        data["content"] = ["First paragraph.", "Second paragraph.", "Third paragraph."]

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], data["title"])

        # Verify content stored as array in database
        blog = BlogPost.objects.get(id=response.data["id"])
        self.assertIsInstance(blog.content, list)
        self.assertEqual(len(blog.content), 3)
        self.assertEqual(blog.content[0], "First paragraph.")

    def test_create_blog_with_string_content(self):
        """Test creating a blog post with string content (frontend format)."""
        data = self.base_blog_data.copy()
        data["content"] = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph."

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify content stored as array in database
        blog = BlogPost.objects.get(id=response.data["id"])
        self.assertIsInstance(blog.content, list)
        self.assertEqual(len(blog.content), 3)
        self.assertEqual(
            blog.content, ["First paragraph.", "Second paragraph.", "Third paragraph."]
        )

    def test_retrieve_blog_returns_string_content(self):
        """Test that retrieving a blog returns content as a string (not array)."""
        # Create blog with array content
        blog = BlogPost.objects.create(
            **self.base_blog_data, content=["Para 1", "Para 2", "Para 3"]
        )

        response = self.client.get(f"/api/blog-posts/{blog.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data["content"], str)
        self.assertEqual(response.data["content"], "Para 1\n\nPara 2\n\nPara 3")

    def test_update_blog_with_string_content(self):
        """Test updating a blog with string content correctly converts to array."""
        # Create initial blog
        blog = BlogPost.objects.create(**self.base_blog_data, content=["Old para"])

        # Update with string content
        update_data = {
            "title": "Updated Title",
            "content": "Updated para 1.\n\nUpdated para 2.",
        }

        response = self.client.patch(
            f"/api/blog-posts/{blog.id}/", update_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify database stores as array
        blog.refresh_from_db()
        self.assertIsInstance(blog.content, list)
        self.assertEqual(blog.content, ["Updated para 1.", "Updated para 2."])

        # Verify response returns string
        self.assertIsInstance(response.data["content"], str)
        self.assertEqual(response.data["content"], "Updated para 1.\n\nUpdated para 2.")

    def test_round_trip_array_to_string_to_array(self):
        """Test full round-trip: create with array → retrieve as string → update with string."""
        # Step 1: Create with array content
        create_data = self.base_blog_data.copy()
        create_data["content"] = [
            "Introduction paragraph.",
            "Main content paragraph.",
            "Conclusion paragraph.",
        ]

        create_response = self.client.post(
            "/api/blog-posts/", create_data, format="json"
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        blog_id = create_response.data["id"]

        # Step 2: Retrieve - should get string
        retrieve_response = self.client.get(f"/api/blog-posts/{blog_id}/")
        self.assertEqual(retrieve_response.status_code, status.HTTP_200_OK)
        retrieved_content = retrieve_response.data["content"]
        self.assertIsInstance(retrieved_content, str)
        expected_string = "Introduction paragraph.\n\nMain content paragraph.\n\nConclusion paragraph."
        self.assertEqual(retrieved_content, expected_string)

        # Step 3: Update using the retrieved string content
        update_data = {
            "title": "Round-trip test update",
            "content": retrieved_content,  # Send string as received from frontend
        }

        update_response = self.client.patch(
            f"/api/blog-posts/{blog_id}/", update_data, format="json"
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        # Step 4: Retrieve again - should still be string
        final_response = self.client.get(f"/api/blog-posts/{blog_id}/")
        self.assertEqual(final_response.status_code, status.HTTP_200_OK)
        final_content = final_response.data["content"]
        self.assertIsInstance(final_content, str)
        self.assertEqual(final_content, expected_string)

        # Step 5: Verify database integrity
        blog = BlogPost.objects.get(id=blog_id)
        self.assertIsInstance(blog.content, list)
        self.assertEqual(
            blog.content,
            [
                "Introduction paragraph.",
                "Main content paragraph.",
                "Conclusion paragraph.",
            ],
        )

    def test_edge_case_empty_string(self):
        """Test handling of empty string content."""
        data = self.base_blog_data.copy()
        data["content"] = ""

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        blog = BlogPost.objects.get(id=response.data["id"])
        self.assertEqual(blog.content, [])
        self.assertEqual(response.data["content"], "")

    def test_edge_case_single_paragraph(self):
        """Test handling of single paragraph content (no newlines)."""
        data = self.base_blog_data.copy()
        data["content"] = "Single paragraph without any newlines."

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        blog = BlogPost.objects.get(id=response.data["id"])
        self.assertEqual(blog.content, ["Single paragraph without any newlines."])
        self.assertEqual(
            response.data["content"], "Single paragraph without any newlines."
        )

    def test_edge_case_html_like_content(self):
        """Test handling of HTML-like content."""
        data = self.base_blog_data.copy()
        data["content"] = (
            '<p>First paragraph with <strong>HTML</strong> tags.</p>\n\n<p>Second with <a href="#">link</a>.</p>'
        )

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        blog = BlogPost.objects.get(id=response.data["id"])
        self.assertEqual(
            blog.content,
            [
                "<p>First paragraph with <strong>HTML</strong> tags.</p>",
                '<p>Second with <a href="#">link</a>.</p>',
            ],
        )
        self.assertEqual(
            response.data["content"],
            '<p>First paragraph with <strong>HTML</strong> tags.</p>\n\n<p>Second with <a href="#">link</a>.</p>',
        )

    def test_edge_case_content_with_extra_whitespace(self):
        """Test that extra whitespace is properly stripped."""
        data = self.base_blog_data.copy()
        data["content"] = (
            "  First with leading/trailing spaces.  \n\n  Second para.  \n\n\n\n"
        )

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        blog = BlogPost.objects.get(id=response.data["id"])
        # Empty strings and whitespace-only strings should be filtered out
        self.assertEqual(
            blog.content, ["First with leading/trailing spaces.", "Second para."]
        )

    def test_edge_case_multiple_consecutive_newlines(self):
        """Test handling of multiple consecutive newlines."""
        data = self.base_blog_data.copy()
        data["content"] = "Para 1\n\n\n\nPara 2\n\n\n\nPara 3"

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        blog = BlogPost.objects.get(id=response.data["id"])
        # Should split on double newlines, empty strings filtered out
        self.assertEqual(blog.content, ["Para 1", "Para 2", "Para 3"])

    def test_create_blog_with_list_content_direct(self):
        """Test creating blog with explicit list content."""
        data = self.base_blog_data.copy()
        data["content"] = ["Only one item"]

        response = self.client.post("/api/blog-posts/", data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        blog = BlogPost.objects.get(id=response.data["id"])
        self.assertEqual(blog.content, ["Only one item"])
        self.assertEqual(response.data["content"], "Only one item")

    def test_serializer_to_internal_value_with_string(self):
        """Test BlogPostSerializer.to_internal_value with string content."""
        serializer = BlogPostSerializer()

        # String input
        input_data = {"content": "Para 1\n\nPara 2\n\nPara 3"}
        result = serializer.to_internal_value(input_data)

        self.assertEqual(result["content"], ["Para 1", "Para 2", "Para 3"])

    def test_serializer_to_internal_value_with_list(self):
        """Test BlogPostSerializer.to_internal_value with list content."""
        serializer = BlogPostSerializer()

        # List input (should pass through)
        input_data = {"content": ["Para 1", "Para 2"]}
        result = serializer.to_internal_value(input_data)

        self.assertEqual(result["content"], ["Para 1", "Para 2"])

    def test_serializer_to_internal_value_with_empty_string(self):
        """Test BlogPostSerializer.to_internal_value with empty string."""
        serializer = BlogPostSerializer()

        # Empty string
        input_data = {"content": ""}
        result = serializer.to_internal_value(input_data)

        self.assertEqual(result["content"], [])

    def test_serializer_to_representation_with_list(self):
        """Test BlogPostSerializer.to_representation converts list to string."""
        blog = BlogPost.objects.create(
            **self.base_blog_data, content=["First", "Second", "Third"]
        )

        serializer = BlogPostSerializer(instance=blog)
        representation = serializer.data

        self.assertIsInstance(representation["content"], str)
        self.assertEqual(representation["content"], "First\n\nSecond\n\nThird")

    def test_serializer_to_representation_with_empty_list(self):
        """Test BlogPostSerializer.to_representation with empty list."""
        blog = BlogPost.objects.create(**self.base_blog_data, content=[])

        serializer = BlogPostSerializer(instance=blog)
        representation = serializer.data

        self.assertEqual(representation["content"], "")

    def test_update_preserves_other_fields(self):
        """Test that updating content doesn't affect other fields."""
        blog = BlogPost.objects.create(**self.base_blog_data, content=["Original"])

        response = self.client.patch(
            f"/api/blog-posts/{blog.id}/",
            {"content": "Updated content.\n\nWith two paras."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check all other fields remain unchanged
        self.assertEqual(response.data["title"], self.base_blog_data["title"])
        self.assertEqual(response.data["excerpt"], self.base_blog_data["excerpt"])
        self.assertEqual(response.data["author"], self.base_blog_data["author"])

        # Content should be updated
        self.assertEqual(
            response.data["content"], "Updated content.\n\nWith two paras."
        )

        # Database should have array
        blog.refresh_from_db()
        self.assertEqual(blog.content, ["Updated content.", "With two paras."])
