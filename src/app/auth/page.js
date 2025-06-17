// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '../../../utils/supabase/client';

// export default function AuthCallbackPage() {
//   const router = useRouter();

//   useEffect(() => {
//     async function confirmUser() {
//       const { error, data } = await supabase.auth.getSessionFromUrl();

//       if (error) {
//         console.error('Error confirming email:', error.message);
//       }

//       // Redirect either way
//       router.push('/login');
//     }

//     confirmUser();
//   }, [router]);

//   return null;
// }
