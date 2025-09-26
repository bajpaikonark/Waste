// import { NavLink, useNavigate } from "react-router-dom"; // Added useNavigate
// import { Home, FilePlus2, User, Map, Award, Hospital } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const BottomNavbar = () => { // Removed onReportClick prop
//   const { currentUser } = useAuth();
//   const navigate = useNavigate(); // Added navigate function

//   const handleReportClick = () => {
//     if (!currentUser) {
//       alert("Please login to report waste");
//       return;
//     }
//     // Navigate to home with state to open report form
//     navigate('/', { state: { openReport: true } });
//   };

//   const navItems = [
//     { 
//       to: "/", 
//       label: "Home", 
//       icon: <Home className="w-6 h-6" />,
//       activeIcon: <Home className="w-6 h-6" fill="currentColor" />
//     },
//     { 
//       to: "/map", 
//       label: "Map", 
//       icon: <Map className="w-6 h-6" />,
//       activeIcon: <Map className="w-6 h-6" fill="currentColor" />
//     },
//     { to:"",
//       label: "Report", 
//       icon: <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center -mt-4">
//               <FilePlus2 className="w-6 h-6 text-white" />
//             </div>,
//       action: handleReportClick,
//       isAction: true
//     },
//     { 
//       to: "/health", 
//       label: "Health", 
//       icon: <Hospital className="w-6 h-6" />,
//       activeIcon: <Hospital className="w-6 h-6" fill="currentColor" />
//     },
//     { 
//       to: "/profile", 
//       label: "Profile", 
//       icon: <User className="w-6 h-6" />,
//       activeIcon: <User className="w-6 h-6" fill="currentColor" />
//     },
//   ];

//   return (
//     <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-3 md:hidden z-50">
//       {navItems.map((item) => (
//         item.to ? (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             className={({ isActive }) =>
//               `flex flex-col items-center text-xs ${
//                 isActive ? "text-green-600 font-semibold" : "text-gray-500"
//               }`
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 {isActive ? item.activeIcon : item.icon}
//                 <span className="mt-1">{item.label}</span>
//               </>
//             )}
//           </NavLink>
//         ) : (
//           <button
//             key={item.label}
//             onClick={item.action}
//             className="flex flex-col items-center text-xs text-gray-500"
//           >
//             {item.icon}
//             {item.label && <span className="mt-1">{item.label}</span>}
//           </button>
//         )
//       ))}
//     </nav>
//   );
// };

// export default BottomNavbar;
import { NavLink, useNavigate } from "react-router-dom";
import { Home, FilePlus2, User, Map, Award, Hospital } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BottomNavbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleReportClick = () => {
    if (!currentUser) {
      alert("Please login to report waste");
      return;
    }
    navigate('/', { state: { openReport: true } });
  };

  const navItems = [
    { 
      to: "/", 
      label: "Home", 
      icon: <Home className="w-6 h-6" />,
      activeIcon: <Home className="w-6 h-6" fill="currentColor" />
    },
    { 
      to: "/map", 
      label: "Map", 
      icon: <Map className="w-6 h-6" />,
      activeIcon: <Map className="w-6 h-6" fill="currentColor" />
    },
    { 
      to: "",
      label: "Report", 
      icon: <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center -mt-4">
              <FilePlus2 className="w-6 h-6 text-white" />
            </div>,
      action: handleReportClick,
      isAction: true
    },
    { 
      to: "/health", 
      label: "Health", 
      icon: <Hospital className="w-6 h-6" />,
      activeIcon: <Hospital className="w-6 h-6" fill="currentColor" />
    },
    { 
      to: "/profile", 
      label: "Profile", 
      icon: <User className="w-6 h-6" />,
      activeIcon: <User className="w-6 h-6" fill="currentColor" />
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-3 z-50">
      {navItems.map((item) => (
        item.to ? (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-green-600 font-semibold" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? item.activeIcon : item.icon}
                <span className="mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ) : (
          <button
            key={item.label}
            onClick={item.action}
            className="flex flex-col items-center text-xs text-gray-500"
          >
            {item.icon}
            {item.label && <span className="mt-1">{item.label}</span>}
          </button>
        )
      ))}
    </nav>
  );
};

export default BottomNavbar;