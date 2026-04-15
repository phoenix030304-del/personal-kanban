"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // window.location.origin sẽ lấy đúng link Codespaces của bạn
          redirectTo: window.location.origin, 
        },
      });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Personal Kanban</CardTitle>
          <CardDescription>Đăng nhập để quản lý công việc của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Đang kết nối..." : "Tiếp tục với Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}