"use client";

import React, { useState, useMemo } from "react";
import { ReportStats } from "@/components/reports/report-stats";
import {
  StudentReportsTable,
  StudentReport,
} from "@/components/reports/student-reports-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IconFilter, IconX } from "@tabler/icons-react";

// Sample student reports data
const studentReportsData: StudentReport[] = [
  {
    id: 1,
    studentId: "STU2024001",
    studentName: "Emma Thompson",
    grade: "Grade 9",
    class: "Mathematics 101",
    submittedDate: "2024-10-15",
    status: "Approved",
    academicScore: 85,
    teacherName: "Dr. Sarah Johnson",
    description:
      "Emma has shown excellent progress in mathematics this quarter. She consistently participates in class discussions and demonstrates strong problem-solving skills. Her test scores have improved significantly, and she shows great potential in advanced topics.",
  },
  {
    id: 2,
    studentId: "STU2024002",
    studentName: "Michael Chen",
    grade: "Grade 10",
    class: "English Literature",
    submittedDate: "2024-10-18",
    status: "Pending",
    academicScore: 78,
    teacherName: "Prof. James Wilson",
    description:
      "Michael has been showing some behavioral concerns in class. While his academic performance is satisfactory, there have been instances of disruption during lessons. A meeting with parents is recommended to discuss strategies for improvement.",
  },
  {
    id: 3,
    studentId: "STU2024003",
    studentName: "Sophia Rodriguez",
    grade: "Grade 11",
    class: "Physics Advanced",
    submittedDate: "2024-10-20",
    status: "Approved",
    academicScore: 92,
    teacherName: "Dr. Emily Brown",
    description:
      "Sophia continues to excel in all aspects of her studies. Her recent physics project on quantum mechanics was exceptional and demonstrated deep understanding. She is a role model for her peers and actively helps other students.",
  },
  {
    id: 4,
    studentId: "STU2024004",
    studentName: "James Wilson",
    grade: "Grade 9",
    class: "Chemistry Basics",
    submittedDate: "2024-10-12",
    status: "Rejected",
    academicScore: 65,
    teacherName: "Dr. Robert Martinez",
    description:
      "James is struggling with basic chemistry concepts and requires additional support. His lab work shows effort, but theoretical understanding needs improvement. Recommend tutoring sessions and parent conference.",
  },
  {
    id: 5,
    studentId: "STU2024005",
    studentName: "Olivia Martinez",
    grade: "Grade 10",
    class: "World History",
    submittedDate: "2024-10-19",
    status: "Approved",
    academicScore: 82,
    teacherName: "Prof. Linda Davis",
    description:
      "Olivia has demonstrated consistent effort and improvement throughout the term. Her essays show critical thinking and good research skills. She actively participates in class discussions and shows genuine interest in historical topics.",
  },
  {
    id: 6,
    studentId: "STU2024006",
    studentName: "Ethan Brown",
    grade: "Grade 11",
    class: "Computer Science",
    submittedDate: "2024-10-21",
    status: "Approved",
    academicScore: 95,
    teacherName: "Dr. Michael Lee",
    description:
      "Ethan's programming abilities are outstanding. He recently developed a mobile app for the school's event management system. His code is clean, well-documented, and shows advanced understanding of software development principles.",
  },
  {
    id: 7,
    studentId: "STU2024007",
    studentName: "Ava Johnson",
    grade: "Grade 10",
    class: "Biology Lab",
    submittedDate: "2024-10-16",
    status: "Pending",
    academicScore: 72,
    teacherName: "Dr. Patricia White",
    description:
      "Ava shows good practical skills in the laboratory but needs to improve her theoretical understanding. Her lab reports are detailed but sometimes lack scientific accuracy. Additional study sessions recommended.",
  },
  {
    id: 8,
    studentId: "STU2024008",
    studentName: "Noah Davis",
    grade: "Grade 9",
    class: "Art & Design",
    submittedDate: "2024-10-10",
    status: "Rejected",
    academicScore: 58,
    teacherName: "Ms. Jennifer Clark",
    description:
      "Noah has been involved in multiple disciplinary incidents. His academic performance has declined, and he shows lack of interest in coursework. Immediate intervention and counseling are necessary.",
  },
  {
    id: 9,
    studentId: "STU2024009",
    studentName: "Isabella Garcia",
    grade: "Grade 10",
    class: "Spanish Language",
    submittedDate: "2024-10-17",
    status: "Approved",
    academicScore: 88,
    teacherName: "Prof. Carlos Rodriguez",
    description:
      "Isabella demonstrates excellent language acquisition skills. Her pronunciation and grammar are strong, and she shows cultural awareness. She actively participates in conversation practice and helps other students.",
  },
  {
    id: 10,
    studentId: "STU2024010",
    studentName: "Liam Anderson",
    grade: "Grade 9",
    class: "Physical Education",
    submittedDate: "2024-10-14",
    status: "Pending",
    academicScore: 70,
    teacherName: "Coach David Thompson",
    description:
      "Liam shows good athletic ability but needs to work on teamwork and sportsmanship. His individual performance is strong, but he sometimes struggles with collaborative activities. Recommend team-building exercises.",
  },
  {
    id: 11,
    studentId: "STU2024011",
    studentName: "Mia Taylor",
    grade: "Grade 11",
    class: "Advanced Mathematics",
    submittedDate: "2024-10-22",
    status: "Approved",
    academicScore: 90,
    teacherName: "Dr. Richard Harris",
    description:
      "Mia consistently demonstrates exceptional mathematical reasoning. She has completed additional advanced problems and shows interest in mathematics competitions. Recommend enrollment in honors program.",
  },
  {
    id: 12,
    studentId: "STU2024012",
    studentName: "Lucas Thomas",
    grade: "Grade 10",
    class: "English Literature",
    submittedDate: "2024-10-13",
    status: "Pending",
    academicScore: 68,
    teacherName: "Prof. Susan Anderson",
    description:
      "Lucas is having difficulty with reading comprehension and literary analysis. His written work shows effort but lacks depth. Recommend reading support program and one-on-one tutoring sessions.",
  },
  {
    id: 13,
    studentId: "STU2024013",
    studentName: "Charlotte Lee",
    grade: "Grade 9",
    class: "Chemistry Basics",
    submittedDate: "2024-10-19",
    status: "Approved",
    academicScore: 80,
    teacherName: "Dr. Robert Martinez",
    description:
      "Charlotte shows strong practical skills and good understanding of chemical concepts. Her lab reports are well-organized and demonstrate scientific thinking. She works well in group experiments.",
  },
  {
    id: 14,
    studentId: "STU2024014",
    studentName: "Benjamin White",
    grade: "Grade 11",
    class: "Physics Advanced",
    submittedDate: "2024-10-18",
    status: "Approved",
    academicScore: 84,
    teacherName: "Dr. Emily Brown",
    description:
      "Benjamin maintains consistent performance across all physics topics. His problem-solving approach is methodical and shows good understanding of fundamental principles. He participates actively in class.",
  },
  {
    id: 15,
    studentId: "STU2024015",
    studentName: "Amelia Harris",
    grade: "Grade 10",
    class: "World History",
    submittedDate: "2024-10-20",
    status: "Pending",
    academicScore: 76,
    teacherName: "Prof. Linda Davis",
    description:
      "Amelia's recent research project on World War II was thorough and well-presented. She shows strong analytical skills and ability to connect historical events. Her class participation could be more frequent.",
  },
  {
    id: 16,
    studentId: "STU2024016",
    studentName: "Alexander Clark",
    grade: "Grade 9",
    class: "Mathematics 101",
    submittedDate: "2024-10-15",
    status: "Pending",
    academicScore: 74,
    teacherName: "Dr. Sarah Johnson",
    description:
      "Alexander has shown steady improvement in his mathematical skills. He asks good questions and seeks help when needed. With continued effort, he should achieve higher grades in upcoming assessments.",
  },
  {
    id: 17,
    studentId: "STU2024017",
    studentName: "Harper Lewis",
    grade: "Grade 11",
    class: "Computer Science",
    submittedDate: "2024-10-21",
    status: "Approved",
    academicScore: 86,
    teacherName: "Dr. Michael Lee",
    description:
      "Harper demonstrates solid understanding of programming concepts. Her recent project on data structures was well-implemented. She collaborates effectively with peers and contributes to group projects.",
  },
  {
    id: 18,
    studentId: "STU2024018",
    studentName: "Daniel Walker",
    grade: "Grade 10",
    class: "Biology Lab",
    submittedDate: "2024-10-16",
    status: "Pending",
    academicScore: 71,
    teacherName: "Dr. Patricia White",
    description:
      "Daniel needs to improve his attention to laboratory safety protocols. While his scientific understanding is adequate, careless handling of equipment is a concern. Additional safety training required.",
  },
  {
    id: 19,
    studentId: "STU2024019",
    studentName: "Evelyn Hall",
    grade: "Grade 9",
    class: "Art & Design",
    submittedDate: "2024-10-17",
    status: "Approved",
    academicScore: 81,
    teacherName: "Ms. Jennifer Clark",
    description:
      "Evelyn shows exceptional creativity and artistic vision. Her portfolio demonstrates mastery of various techniques. She has been selected to represent the school in the regional art competition.",
  },
  {
    id: 20,
    studentId: "STU2024020",
    studentName: "Matthew Young",
    grade: "Grade 10",
    class: "Spanish Language",
    submittedDate: "2024-10-19",
    status: "Pending",
    academicScore: 83,
    teacherName: "Prof. Carlos Rodriguez",
    description:
      "Matthew is making good progress in Spanish language acquisition. His written work is strong, though oral communication needs more practice. Recommend participation in conversation clubs.",
  },
];

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Get unique values for filter options
  const classes = useMemo(() => {
    const uniqueClasses = [
      ...new Set(studentReportsData.map((report) => report.class)),
    ];
    return uniqueClasses;
  }, []);

  const terms = ["Term 1", "Term 2", "Term 3", "Term 4"];
  const years = ["2024", "2023", "2022"];

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return studentReportsData.filter((report) => {
      const classMatch =
        selectedClass === "all" || report.class === selectedClass;
      const termMatch =
        selectedTerm === "all" ||
        new Date(report.submittedDate).getMonth() + 1 ===
          parseInt(selectedTerm);
      const yearMatch =
        selectedYear === "all" ||
        new Date(report.submittedDate).getFullYear() === parseInt(selectedYear);

      return classMatch && termMatch && yearMatch;
    });
  }, [selectedClass, selectedTerm, selectedYear]);

  const handleApproveAll = () => {
    console.log("Approving all pending reports");
  };

  const handleRejectAll = () => {
    console.log("Rejecting all pending reports");
  };

  const handleExportAll = () => {
    console.log("Exporting all reports");
  };

  const clearFilters = () => {
    setSelectedClass("all");
    setSelectedTerm("all");
    setSelectedYear("all");
  };

  const hasActiveFilters =
    selectedClass !== "all" || selectedTerm !== "all" || selectedYear !== "all";

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold text-primary">
            Student Reports
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Current Term: Term 2, 2024
            </Badge>
            <span className="text-sm text-muted-foreground">
              Academic Reports Only
            </span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-4 lg:px-6 py-4">
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
          <div className="flex items-center gap-2">
            <IconFilter className="h-4 w-4" />
            <span className="font-medium">Filter Reports</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                <IconX className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {terms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedClass !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Class: {selectedClass}
                </Badge>
              )}
              {selectedTerm !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Term: {selectedTerm}
                </Badge>
              )}
              {selectedYear !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Year: {selectedYear}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <ReportStats />
      <StudentReportsTable
        data={filteredData}
        onApproveAll={handleApproveAll}
        onRejectAll={handleRejectAll}
        onExportAll={handleExportAll}
      />
    </div>
  );
}
