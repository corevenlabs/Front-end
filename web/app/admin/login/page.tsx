import type { Metadata } from 'next';
import { LogoMarca } from '@/components/Logo';
import { FormularioLogin } from '@/components/admin/FormularioLogin';
import s from '@/components/admin/Admin.module.css';

export const metadata: Metadata = { title: 'Entrar' };

export default async function Login(props: PageProps<'/admin/login'>) {
  const { desde } = await props.searchParams;
  return (
    <main className={s.login}>
      <div className={s.loginCaja}>
        <div className={s.loginMarca}><LogoMarca className={s.loginLogo} /> Corevenlabs <span>Admin</span></div>
        <FormularioLogin desde={typeof desde === 'string' ? desde : ''} />
      </div>
    </main>
  );
}
