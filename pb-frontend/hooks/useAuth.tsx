import { useState, useEffect, createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import { triggerRewardNotification } from '../components/RewardNotification';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    profile: {
        phone: string;
        address: string;
        points: number;
        tier: string;
        savings: number;
        city: string;
        state: string;
        pin_code: string;
    };
}

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    login: (token: string, refresh: string) => void;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    }, []);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Token might be expired
                logout();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const login = useCallback((token: string, refresh: string) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token', refresh);
        checkAuth();
    }, [checkAuth]);

    const register = useCallback(async (userData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const regData = await response.json();
                if (regData.points_earned > 0) {
                    triggerRewardNotification(regData.points_earned, "Welcome to the Pinobite Club!");
                }
                // Auto login after register
                const loginResponse = await fetch(`${API_BASE_URL}/api/token/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userData.email,
                        password: userData.password
                    }),
                });

                if (loginResponse.ok) {
                    const tokens = await loginResponse.json();
                    login(tokens.access, tokens.refresh);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    }, [login]);



    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const value = useMemo(() => ({
        user, isLoading, login, register, logout, checkAuth
    }), [user, isLoading, login, register, logout, checkAuth]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
