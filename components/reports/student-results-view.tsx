import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ReportCardView = () => {
  const subjects = [
    {
      name: "English",
      sem1: {
        pt1: "7.3",
        pr1: "4",
        tot1: "7.3",
        gr1: "B+",
        nb1: "4",
        gr2: "C",
        se1: "4",
        gr3: "A+",
        halfYearly: "52.8",
        gr4: "B+",
        total: "68.1",
        grade: "B2",
      },
      sem2: {
        pt2: "7.3",
        gr1: "C",
        nb2: "4",
        gr2: "A",
        se2: "4",
        gr3: "C",
        annual: "70.4",
        gr4: "B",
        total: "85.7",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "Hindi",
      sem1: {
        pt1: "9",
        pr1: "5",
        tot1: "9",
        gr1: "C",
        nb1: "5",
        gr2: "A+",
        se1: "4",
        gr3: "B+",
        halfYearly: "65.6",
        gr4: "C",
        total: "83.6",
        grade: "A2",
      },
      sem2: {
        pt2: "8.3",
        gr1: "A",
        nb2: "4",
        gr2: "C",
        se2: "4",
        gr3: "B",
        annual: "59.2",
        gr4: "A",
        total: "75.5",
        grade: "B1",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "Maths",
      sem1: {
        pt1: "7.3",
        pr1: "5",
        tot1: "7.3",
        gr1: "A+",
        nb1: "5",
        gr2: "B+",
        se1: "4",
        gr3: "C",
        halfYearly: "65.6",
        gr4: "A",
        total: "81.9",
        grade: "A2",
      },
      sem2: {
        pt2: "10",
        gr1: "C+",
        nb2: "4",
        gr2: "B",
        se2: "4",
        gr3: "A",
        annual: "59.2",
        gr4: "B+",
        total: "77.2",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "EVS",
      sem1: {
        pt1: "8.3",
        pr1: "4",
        tot1: "8.3",
        gr1: "B+",
        nb1: "4",
        gr2: "C",
        se1: "5",
        gr3: "A",
        halfYearly: "62.4",
        gr4: "C+",
        total: "79.7",
        grade: "B2",
      },
      sem2: {
        pt2: "6.7",
        gr1: "B",
        nb2: "4",
        gr2: "A",
        se2: "4",
        gr3: "B+",
        annual: "70.4",
        gr4: "B+",
        total: "85.1",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "Drawing",
      sem1: {
        pt1: "10",
        pr1: "5",
        tot1: "10",
        gr1: "C",
        nb1: "5",
        gr2: "A",
        se1: "4",
        gr3: "C+",
        halfYearly: "76.8",
        gr4: "B",
        total: "95.8",
        grade: "A1",
      },
      sem2: {
        pt2: "10",
        gr1: "A",
        nb2: "5",
        gr2: "B+",
        se2: "4",
        gr3: "B+",
        annual: "62.4",
        gr4: "C",
        total: "81.4",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "General Knowledge",
      sem1: {
        pt1: "8.3",
        pr1: "4",
        tot1: "8.3",
        gr1: "A",
        nb1: "4",
        gr2: "C+",
        se1: "5",
        gr3: "B",
        halfYearly: "62.4",
        gr4: "A",
        total: "79.7",
        grade: "B2",
      },
      sem2: {
        pt2: "6.7",
        gr1: "B+",
        nb2: "4",
        gr2: "B+",
        se2: "4",
        gr3: "C",
        annual: "70.4",
        gr4: "A+",
        total: "85.1",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "Physics",
      sem1: {
        pt1: "10",
        pr1: "5",
        tot1: "10",
        gr1: "C+",
        nb1: "5",
        gr2: "B",
        se1: "4",
        gr3: "A",
        halfYearly: "76.8",
        gr4: "B+",
        total: "95.8",
        grade: "A1",
      },
      sem2: {
        pt2: "10",
        gr1: "B+",
        nb2: "5",
        gr2: "C",
        se2: "4",
        gr3: "A+",
        annual: "62.4",
        gr4: "B+",
        total: "81.4",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "Biology",
      sem1: {
        pt1: "8.3",
        pr1: "4",
        tot1: "8.3",
        gr1: "B",
        nb1: "4",
        gr2: "A",
        se1: "5",
        gr3: "B+",
        halfYearly: "62.4",
        gr4: "B+",
        total: "79.7",
        grade: "B2",
      },
      sem2: {
        pt2: "6.7",
        gr1: "C",
        nb2: "4",
        gr2: "A+",
        se2: "4",
        gr3: "B+",
        annual: "70.4",
        gr4: "C",
        total: "85.1",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "GK",
      sem1: {
        pt1: "10",
        pr1: "5",
        tot1: "10",
        gr1: "A",
        nb1: "5",
        gr2: "B+",
        se1: "4",
        gr3: "B+",
        halfYearly: "76.8",
        gr4: "C",
        total: "95.8",
        grade: "A1",
      },
      sem2: {
        pt2: "10",
        gr1: "A+",
        nb2: "5",
        gr2: "B+",
        se2: "4",
        gr3: "C",
        annual: "62.4",
        gr4: "A+",
        total: "81.4",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
    {
      name: "Moral Science",
      sem1: {
        pt1: "8.3",
        pr1: "4",
        tot1: "8.3",
        gr1: "B+",
        nb1: "4",
        gr2: "B+",
        se1: "5",
        gr3: "C",
        halfYearly: "62.4",
        gr4: "A+",
        total: "79.7",
        grade: "B2",
      },
      sem2: {
        pt2: "6.7",
        gr1: "B+",
        nb2: "4",
        gr2: "C",
        se2: "4",
        gr3: "A+",
        annual: "70.4",
        gr4: "C",
        total: "85.1",
        grade: "A2",
      },
      grandTotal: "76.9",
      finalGrade: "B1",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 ">
      <Card className=" border-gray-800 rounded-none shadow-none">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b-2 border-gray-800">
            <div className="w-16 h-16 bg-sidebar rounded flex items-center justify-center text-xs font-bold">
              LOGO
            </div>
            <div>
              <h1 className="text-2xl font-bold">NAVYUG PUBLIC SCHOOL</h1>
              <p className="text-xs text-gray-600">
                Survey no. 19, 13, Ambalipura, Vathur Hobli, Ambalipura -
                Sarjapur Rd, beside Springfield Apartments, Bengaluru, Karnataka
                560103
              </p>
            </div>
          </div>

          {/* Report Card Title */}
          <div className="bg-sidebar py-2 px-4 border-b border-gray-400">
            <h2 className="text-center font-bold">
              FINAL REPORT CARD SESSION 2021 - 2022
            </h2>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-400">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold">Name:</span>
                <span>Rahul Kumar</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Father's name:</span>
                <span>Mr. Aman Sharma</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Mother's name:</span>
                <span>Mrs. Neha Sharma</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold">Enrollment Number:</span>
                <span>12345678</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Class:</span>
                <span>VII</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Roll No:</span>
                <span>7110</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold">DOB:</span>
                <span>22/01/2009</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Section:</span>
                <span>A</span>
              </div>
            </div>
          </div>

          {/* Scholastic Area */}
          <div className="bg-sidebar py-2 px-4 border-b border-gray-400">
            <h2 className="text-center font-bold">SCHOLASTIC AREA</h2>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sidebar">
                  <th
                    rowSpan={3}
                    className="border border-gray-400 font-bold text-center align-middle p-2"
                  >
                    SUBJECT
                  </th>
                  <th
                    colSpan={10}
                    className="border border-gray-400 font-bold text-center p-2"
                  >
                    Semester 1
                  </th>
                  <th
                    colSpan={10}
                    className="border border-gray-400 font-bold text-center p-2"
                  >
                    Semester 2
                  </th>
                  <th
                    rowSpan={3}
                    className="border border-gray-400 font-bold text-center align-middle p-2"
                  >
                    Total
                  </th>
                </tr>
                <tr className="bg-sidebar text-xs">
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    PT 1
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    NB 1
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    SE 1
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    Half Yearly Exam
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    Total
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    PT 2
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    NB 2
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    SE 2
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    Annual Exam
                  </th>
                  <th
                    colSpan={2}
                    className="border border-gray-400 text-center p-1"
                  >
                    Total
                  </th>
                </tr>
                <tr className="bg-sidebar text-xs">
                  <th className="border border-gray-400 text-center p-1">
                    Tot (10)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (5)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (5)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (80)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (100)
                  </th>
                  <th className="border border-gray-400 text-center p-1">
                    Grade
                  </th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (10)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (5)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (5)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (80)
                  </th>
                  <th className="border border-gray-400 text-center p-1">Gr</th>
                  <th className="border border-gray-400 text-center p-1">
                    Tot (100)
                  </th>
                  <th className="border border-gray-400 text-center p-1">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="text-xs">
                    <td className="border border-gray-400 font-semibold p-2">
                      {subject.name}
                    </td>
                    {/* Semester 1 */}
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem1.pt1}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem1.gr1}
                    </td>
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem1.nb1}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem1.gr2}
                    </td>
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem1.se1}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem1.gr3}
                    </td>
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem1.halfYearly}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem1.gr4}
                    </td>
                    <td className="border border-gray-400 text-center font-semibold bg-sidebar p-1">
                      {subject.sem1.total}
                    </td>
                    <td className="border border-gray-400 text-center font-semibold p-1">
                      {subject.sem1.grade}
                    </td>
                    {/* Semester 2 */}
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem2.pt2}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem2.gr1}
                    </td>
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem2.nb2}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem2.gr2}
                    </td>
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem2.se2}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem2.gr3}
                    </td>
                    <td className="border border-gray-400 text-center bg-sidebar p-1">
                      {subject.sem2.annual}
                    </td>
                    <td className="border border-gray-400 text-center p-1">
                      {subject.sem2.gr4}
                    </td>
                    <td className="border border-gray-400 text-center font-semibold bg-sidebar p-1">
                      {subject.sem2.total}
                    </td>
                    <td className="border border-gray-400 text-center font-semibold p-1">
                      {subject.sem2.grade}
                    </td>
                    {/* Grand Total */}
                    <td className="border border-gray-400 text-center font-bold bg-sidebar p-1">
                      {subject.grandTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="grid grid-cols-3 border-t-2 border-gray-800">
            <div className="p-3 border-r border-gray-400">
              <span className="font-bold">Grand Total: 482.4/600</span>
            </div>
            <div className="p-3 border-r border-gray-400">
              <span className="font-bold">Percentage: 80.4</span>
            </div>
            <div className="p-3">
              <span className="font-bold">Grade: B1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCardView;
