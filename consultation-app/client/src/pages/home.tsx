import Header from '../components/header/header';
import Doctors from '../components/doctors/doctors';
import Appointments from '../components/appointments/appointments';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Appointments />
        <Doctors />
      </main>
    </>
  );
}
