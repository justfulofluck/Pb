import sys

file_path = '/home/bhavan/Public/Pynatic/Pb/pb-frontend/components/Dashboard.tsx'

with open(file_path, 'r') as f:
    lines = f.readlines()

# Find wishlist block
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{activeTab === 'wishlist' && (" in line:
        start_idx = i
        break

if start_idx != -1:
    # Find the closing tag for the wishlist block
    open_brackets = 0
    for i in range(start_idx, len(lines)):
        open_brackets += lines[i].count('{') - lines[i].count('}')
        if open_brackets == 0 and i > start_idx:
            end_idx = i
            break

# Extract the wishlist inner content (we don't want the {activeTab === 'wishlist' && ( ... )} wrapper)
if start_idx != -1 and end_idx != -1:
    wishlist_wrapper = lines[start_idx:end_idx+1]
    
    # We want just the inner div: lines[start_idx+6 : end_idx-1]
    # Let's see: 
    # {activeTab === 'wishlist' && (
    #   <motion.div ...>
    #     <div className="bg-white p-5 sm:p-8 rounded-[32px] ...
    # ...
    #   </motion.div>
    # )}
    
    inner_block = []
    div_start = -1
    for i, line in enumerate(wishlist_wrapper):
        if '<div className="bg-white p-5 sm:p-8 rounded-[32px]' in line:
            div_start = i
            break
            
    if div_start != -1:
        # The inner block ends 2 lines before end_idx (before </motion.div> and )}
        inner_block = wishlist_wrapper[div_start:-2]
        
    # Remove the entire wishlist block from the file
    del lines[start_idx:end_idx+1]
    
    # Now find where to insert it: inside activeTab === 'orders'
    # We look for:
    #                   )}
    #                 </motion.div>
    #               )}
    #               {activeTab === 'profile' && (
    
    insert_idx = -1
    for i, line in enumerate(lines):
        if "{activeTab === 'profile' && (" in line:
            # Go back to find the closing of 'orders'
            for j in range(i-1, -1, -1):
                if "</motion.div>" in lines[j]:
                    insert_idx = j
                    break
            break
            
    if insert_idx != -1:
        # Insert the inner_block before </motion.div>
        # Add a separator
        lines.insert(insert_idx, '\n                  {/* Wishlist Section */}\n')
        for line in reversed(inner_block):
            lines.insert(insert_idx + 1, line)
            
    with open(file_path, 'w') as f:
        f.writelines(lines)
    print("Successfully moved wishlist into orders tab.")
else:
    print("Could not find wishlist block.")
