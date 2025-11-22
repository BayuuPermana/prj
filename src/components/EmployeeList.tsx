import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: string;
}

interface Attendance {
  employeeId: { _id: string } | string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: string;
  totalHours: string;
}

interface EmployeeView extends Employee {
  clockIn: string;
  clockOut: string;
  totalHours: string;
  status: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeView[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeView[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;

      try {
        // Fetch Employees
        const empRes = await fetch('http://localhost:3001/api/employees', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const empData: Employee[] = await empRes.json();

        // Fetch Attendance (All for now, ideally filter by date)
        const attRes = await fetch('http://localhost:3001/api/attendance', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const attData: Attendance[] = await attRes.json();

        const today = new Date().toISOString().split('T')[0];

        // Merge Data
        const mergedData: EmployeeView[] = empData.map(emp => {
          // Find attendance for this employee for today
          const attendance = attData.find(a => {
            const empId = typeof a.employeeId === 'object' ? a.employeeId._id : a.employeeId;
            return empId === emp._id && a.date === today;
          });

          return {
            ...emp,
            clockIn: attendance?.clockIn || '-',
            clockOut: attendance?.clockOut || '-',
            totalHours: attendance?.totalHours || '-',
            status: attendance?.status || 'Absent'
          };
        });

        setEmployees(mergedData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    let filtered = employees;

    if (activeFilter !== 'All') {
      filtered = filtered.filter(employee => employee.status === activeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [activeFilter, searchQuery, employees]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Name,Clock In,Clock Out,Total Hours,Status\n"
      + filteredEmployees.map(e => `${e.name},${e.clockIn},${e.clockOut},${e.totalHours},${e.status}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="px-6 pb-6">
      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-64"
          />
          <input
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={handleExportData}
        >
          Export Data
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'On Time', 'Late', 'Absent'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transition-colors">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /></th>
              <th className="p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">EMPLOYEE NAME</th>
              <th className="p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CLOCK-IN</th>
              <th className="p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CLOCK-OUT</th>
              <th className="p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">TOTAL HOURS</th>
              <th className="p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedEmployees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="p-4"><input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /></td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold mr-3">
                      {getInitials(employee.name)}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{employee.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{employee.clockIn}</td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{employee.clockOut}</td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{employee.totalHours}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'On Time' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      employee.status === 'Late' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        employee.status === 'Absent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {employee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Showing {paginatedEmployees.length} of {filteredEmployees.length} results</span>
        <div className="flex gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {[...Array(totalPages || 0)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded transition-colors ${currentPage === i + 1
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
