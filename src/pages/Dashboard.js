
import React from 'react';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import FileUpload from '../components/upload-file';
import ResponsiveAppBar from '../layouts/dashboard/nav-bar';
const Dashboard = () => {
  return  <div>
    <ResponsiveAppBar />
    <FileUpload />
  </div> ;
};

export default Dashboard;
