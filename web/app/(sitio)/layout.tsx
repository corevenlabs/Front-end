import { Nav } from '@/components/Nav';
import { Pie } from '@/components/Pie';
import { Revelar } from '@/components/Revelar';
import { Analitica } from '@/components/Analitica';

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="saltar" href="#contenido">Saltar al contenido</a>
      <Nav />
      <main id="contenido" className="sitio-publico">{children}</main>
      <Pie />
      <Revelar />
      <Analitica />
    </>
  );
}
