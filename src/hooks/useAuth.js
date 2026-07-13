import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout, setUser } from '@/store/authSlice';

export default function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      dispatch(setUser({ token }));
      setLoading(false);
    }
  }, [dispatch, router]);

  return { loading };
}
