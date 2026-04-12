import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../../context/DataContext';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import DefaultLayout from '../../../layouts/admin/DefaultLayout';
import { Users, UserCheck, MessageSquare, Radio, TrendingUp, TrendingDown } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';

const AdminDashboard = () => {
  const { data } = useContext(DataContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalInquiries: data.messages?.length || 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const teachersSnap = await getDocs(collection(db, 'authorizedTeachers'));
        const classesSnap = await getDocs(collection(db, 'liveClasses'));
        
        const students = usersSnap.docs.filter(d => d.data().role !== 'teacher').length;
        
        setStats({
          totalStudents: students,
          totalTeachers: teachersSnap.size,
          totalClasses: classesSnap.size,
          totalInquiries: data.messages?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, [data.messages]);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#3C50E0', '#80CAEE'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { position: 'top', horizontalAlign: 'left' },
    grid: { strokeDashArray: 5 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
  };

  const chartSeries = [
    { name: 'Students', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: 'Teachers', data: [11, 32, 45, 32, 34, 52, 41] },
  ];

  const StatCard = ({ title, value, icon: Icon, color, percent, isUp }) => (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4`}>
        <Icon className={color} size={22} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {value}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <span className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-meta-3' : 'text-meta-1'}`}>
          {percent}%
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </span>
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          color="text-primary" 
          percent="12.5" 
          isUp={true} 
        />
        <StatCard 
          title="Teachers" 
          value={stats.totalTeachers} 
          icon={UserCheck} 
          color="text-secondary" 
          percent="4.3" 
          isUp={true} 
        />
        <StatCard 
          title="Total Classes" 
          value={stats.totalClasses} 
          icon={Radio} 
          color="text-meta-3" 
          percent="2.5" 
          isUp={false} 
        />
        <StatCard 
          title="Inquiries" 
          value={stats.totalInquiries} 
          icon={MessageSquare} 
          color="text-meta-5" 
          percent="0.4" 
          isUp={true} 
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div className="flex w-full flex-wrap gap-3 sm:gap-5">
              <div className="flex min-w-47.5">
                <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                  <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                </span>
                <div className="w-full">
                  <p className="font-semibold text-primary">Total Students</p>
                  <p className="text-sm font-medium">12.04.2024 - 12.05.2024</p>
                </div>
              </div>
              <div className="flex min-w-47.5">
                <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                  <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
                </span>
                <div className="w-full">
                  <p className="font-semibold text-secondary">Total Teachers</p>
                  <p className="text-sm font-medium">12.04.2024 - 12.05.2024</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div id="chartOne" className="-ml-5">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={350}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
                Recent Tutors
            </h4>
            <div className="flex flex-col gap-4">
                {data.tutors?.slice(0, 5).map((tutor, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-3 px-7.5 hover:bg-gray-2 dark:hover:bg-meta-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src={tutor.image} alt={tutor.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-medium text-black dark:text-white">{tutor.name}</p>
                            <p className="text-xs">{tutor.subject}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AdminDashboard;
