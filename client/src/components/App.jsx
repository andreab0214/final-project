import { useEffect, useState } from "react";
import {Routes, Route} from "react-router-dom"
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import Homepage from "./Homepage";
import styled from "styled-components";
import Packages from "./Packages";
import PackagePayment from "./PackagePayment";
import Dashboard from "./Dashboard";
import UserProfile from "./UserProfile";
import Login from "./Login";
import SignUp from "./SignUp";
import CreateJob from "./CreateJob";
import JobDetails from "./JobDetails";
import ApprovedJobs from "./ApprovedJobs";
import Footer from "./Footer";
import AddManager from "./AddManager";

const App = () => {

  return (
    <div>
      <GlobalStyles />
      <Header />
      <Main>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/packages" element={<Packages/>} />
        <Route path="/purchase/:packageName" element={<PackagePayment/>} />
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/dashboard/:userName" element={<UserProfile />} />
        <Route path="/approvedJobs/:userName" element={<ApprovedJobs />} />
        <Route path="/createjob" element={<CreateJob />} />
        <Route path="/add-manager" element={<AddManager />} />
        <Route path="/jobs/:userName/:jobId" element={<JobDetails />} />
      </Routes>
      </Main>
      <Footer />
    </div>
  );
}

const Main = styled.main`
  padding-top: 5rem;
  padding-bottom: 6rem;
  padding-left: 2rem;
  padding-right: 2rem;
`

export default App;
