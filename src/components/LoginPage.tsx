import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // State for signup
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");

  // Password strength check
  const isStrongPassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  // Email validation
  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!validateEmail(loginEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Password is required.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        // Store the token in localStorage for future requests
        localStorage.setItem('access_token', data.access_token);
        setLoginError("");
        onLogin();
      } else {
        const data = await res.json();
        setLoginError(data.detail || "Sign in failed. Please check your credentials.");
      }
    } catch {
      setLoginError("Sign in failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    if (!validateEmail(signupEmail)) {
      setSignupError("Please enter a valid email address.");
      return;
    }
    if (!isStrongPassword(signupPassword)) {
      setSignupError("Password must be at least 8 characters, include a number and an uppercase letter.");
      return;
    }
    setIsLoading(true);
    try {
      const full_name = `${signupFirstName} ${signupLastName}`.trim();
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, password: signupPassword, full_name })
      });
      if (res.ok) {
        setSignupSuccess("Account created! You can now sign in.");
        setSignupError("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupFirstName("");
        setSignupLastName("");
      } else {
        const data = await res.json();
        setSignupError(data.detail || "Signup failed. Please try again.");
      }
    } catch {
      setSignupError("Signup failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground text-lg font-bold">P</span>
            </div>
            <span className="text-3xl font-bold text-foreground">Pluto</span>
          </div>
          <p className="text-muted-foreground">
            Your personal finance companion
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-background">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-background">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {loginError && (
                    <div className="text-red-500 text-sm text-center">{loginError}</div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="bg-input-background border-border"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="bg-input-background border-border pr-10"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="link" size="sm" className="px-0 text-primary" disabled={isLoading}>
                      Forgot password?
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                      className="bg-background hover:bg-accent"
                    >
                      {/* ...existing code... */}
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('apple')}
                      disabled={isLoading}
                      className="bg-background hover:bg-accent"
                    >
                      {/* ...existing code... */}
                      Apple
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  {signupError && (
                    <div className="text-red-500 text-sm text-center">{signupError}</div>
                  )}
                  {signupSuccess && (
                    <div className="text-green-600 text-sm text-center">{signupSuccess}</div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        required
                        className="bg-input-background border-border"
                        value={signupFirstName}
                        onChange={e => setSignupFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        required
                        className="bg-input-background border-border"
                        value={signupLastName}
                        onChange={e => setSignupLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="bg-input-background border-border"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        required
                        className="bg-input-background border-border pr-10"
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By creating an account, you agree to our{" "}
                    <Button variant="link" size="sm" className="px-0 h-auto text-xs text-primary" disabled={isLoading}>
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" size="sm" className="px-0 h-auto text-xs text-primary" disabled={isLoading}>
                      Privacy Policy
                    </Button>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}