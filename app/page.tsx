import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import About from '../components/About';
import StartupList from '../components/StartupList';
import UpcomingEvents from '../components/UpcomingEvents';
import CoreTeam from '../components/CoreTeam';
import Gallery from '../components/Gallery';
import Collaborations from '../components/Collaborations';
import JoinForm from '../components/JoinForm';
import Footer from '../components/Footer';
import {
  getCollaborations,
  getCoreTeamMembers,
  getPastTeamMembers,
  getSuccessfulEvents,
  getUpcomingEvents,
  getStartupList,
  submitJoinForm,
} from '../api/user';

type JoinFormPayload = {
  fullName: string;
  mobileNo: number;
  year: string;
  emailId: string;
  studentType: string;
  branch: string;
};

async function submitJoinFormAction(payload: JoinFormPayload) {
  'use server';
  return submitJoinForm(payload);
}

export default async function Home() {
  const teamMembers = await getCoreTeamMembers();
  const pastMembers = await getPastTeamMembers();
  const upcomingEvents = await getUpcomingEvents();
  const successfulEvents = await getSuccessfulEvents();
  const collaborations = await getCollaborations();
  const startups = await getStartupList();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Banner />
      <About />
      <StartupList startups={startups} />
      <UpcomingEvents events={upcomingEvents} successfulEvents={successfulEvents} />
      <CoreTeam teamMembers={teamMembers} pastMembers={pastMembers} />
      {/* <Gallery /> */}
      <Collaborations collaborations={collaborations} />
      <JoinForm submitJoinFormAction={submitJoinFormAction} />
      <Footer />
    </div>
  );
}
