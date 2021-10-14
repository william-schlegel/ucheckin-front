import { Layout } from './layout';
import UmitNav from './UmitNav';

export default function Sensors() {
  return (
    <Layout>
      <UmitNav active={'sensors'} />
      <div>Sensors</div>
    </Layout>
  );
}
