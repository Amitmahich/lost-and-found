// AdminDashboard.jsx

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { db } from "../../firebase/config";
import "../../styles/AdminDashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    users: 0,
    blockedUsers: 0,
    reports: 0,
    handledReports: 0,
  });

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (usersSnap) => {
      const totalUsers = usersSnap.size;
      const blockedUsers = usersSnap.docs.filter(
        (doc) => doc.data().isBlocked
      ).length;

      setStats((prev) => ({
        ...prev,
        users: totalUsers,
        blockedUsers,
      }));
    });

    const unsubItems = onSnapshot(collection(db, "items"), (itemsSnap) => {
      const lostItems = itemsSnap.docs.filter(
        (doc) => doc.data().itemType === "Lost it"
      ).length;
      const foundItems = itemsSnap.docs.filter(
        (doc) => doc.data().itemType === "Found it"
      ).length;

      setStats((prev) => ({
        ...prev,
        lostItems,
        foundItems,
      }));
    });

    const unsubReports = onSnapshot(
      collection(db, "reports"),
      (reportsSnap) => {
        const totalReports = reportsSnap.size;
        const handledReports = reportsSnap.docs.filter(
          (doc) => doc.data().isHandled
        ).length;

        setStats((prev) => ({
          ...prev,
          reports: totalReports,
          handledReports,
        }));
      }
    );

    return () => {
      unsubUsers();
      unsubItems();
      unsubReports();
    };
  }, []);

  // Common Labels + Colors
  const labels = [
    "Lost Items",
    "Found Items",
    "Users",
    "Blocked Users",
    "Reports",
    "Handled Reports",
  ];
  const values = [
    stats.lostItems,
    stats.foundItems,
    stats.users,
    stats.blockedUsers,
    stats.reports,
    stats.handledReports,
  ];
  const colors = [
    "#ff6384",
    "#36a2eb",
    "#ffcd56",
    "#9966ff",
    "#ff9f40",
    "#4bc0c0",
  ];

  // Pie Chart
  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart (all stats)
  const barData = {
    labels,
    datasets: [
      {
        label: "Counts",
        data: values,
        backgroundColor: colors,
      },
    ],
  };

  // Line Chart (all stats)
  const lineData = {
    labels,
    datasets: [
      {
        label: "Counts",
        data: values,
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: colors,
        pointBorderColor: "#fff",
        pointRadius: 6,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Overview</h3>
          <Pie data={pieData} />
        </div>

        <div className="chart-card">
          <h3>All Stats (Bar)</h3>
          <Bar data={barData} />
        </div>

        <div className="chart-card">
          <h3>All Stats (Line)</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}
