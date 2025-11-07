"use client"

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconSchool,
  IconChartBar,
  IconClipboardList,
  IconFileText,
} from "@tabler/icons-react"
import StudentPerformanceView from '@/components/reports/student-performance-view'
import StudentResultsView from '@/components/reports/student-results-view'

// Mock data - replace with actual API calls
const mockStudentData = {
  'stu001': {
    id: 'stu001',
    name: 'Emma Thompson',
    studentId: 'STU2024001',
    email: 'emma.thompson@student.edu',
    phone: '+1 (555) 201-3001',
    dateOfBirth: '2009-05-15',
    className: 'Primary 5A',
    averageScore: 85,
    attendance: 95,
    status: 'Excellent',
    subjects: [
      {
        id: 'english',
        name: 'English Language',
        score: 88,
        grade: 'A',
        assessments: 8,
        lastUpdated: '2024-10-22'
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        score: 85,
        grade: 'A',
        assessments: 10,
        lastUpdated: '2024-10-23'
      },
      {
        id: 'science',
        name: 'Basic Science',
        score: 82,
        grade: 'B+',
        assessments: 6,
        lastUpdated: '2024-10-20'
      },
      {
        id: 'social-studies',
        name: 'Social Studies',
        score: 86,
        grade: 'A',
        assessments: 5,
        lastUpdated: '2024-10-21'
      }
    ],
    recentAttendance: [
      { date: '2024-10-23', status: 'Present' },
      { date: '2024-10-22', status: 'Present' },
      { date: '2024-10-21', status: 'Present' },
      { date: '2024-10-20', status: 'Present' },
      { date: '2024-10-19', status: 'Late' },
      { date: '2024-10-18', status: 'Present' },
      { date: '2024-10-17', status: 'Present' },
      { date: '2024-10-16', status: 'Present' }
    ],
    parentName: 'Sarah Thompson',
    parentPhone: '+1 (555) 201-3000',
    parentEmail: 'sarah.thompson@email.com'
  },
  'stu002': {
    id: 'stu002',
    name: 'Michael Chen',
    studentId: 'STU2024002',
    email: 'michael.chen@student.edu',
    phone: '+1 (555) 202-3002',
    dateOfBirth: '2008-08-22',
    className: 'Primary 5A',
    averageScore: 78,
    attendance: 90,
    status: 'Good',
    subjects: [
      {
        id: 'english',
        name: 'English Language',
        score: 75,
        grade: 'B',
        assessments: 8,
        lastUpdated: '2024-10-22'
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        score: 82,
        grade: 'B+',
        assessments: 10,
        lastUpdated: '2024-10-23'
      },
      {
        id: 'science',
        name: 'Basic Science',
        score: 76,
        grade: 'B',
        assessments: 6,
        lastUpdated: '2024-10-20'
      },
      {
        id: 'social-studies',
        name: 'Social Studies',
        score: 79,
        grade: 'B+',
        assessments: 5,
        lastUpdated: '2024-10-21'
      }
    ],
    recentAttendance: [
      { date: '2024-10-23', status: 'Present' },
      { date: '2024-10-22', status: 'Present' },
      { date: '2024-10-21', status: 'Absent' },
      { date: '2024-10-20', status: 'Present' },
      { date: '2024-10-19', status: 'Present' },
      { date: '2024-10-18', status: 'Late' },
      { date: '2024-10-17', status: 'Present' },
      { date: '2024-10-16', status: 'Present' }
    ],
    parentName: 'David Chen',
    parentPhone: '+1 (555) 202-3000',
    parentEmail: 'david.chen@email.com'
  }
}

export default function StudentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.id as string
  const [activeTab, setActiveTab] = useState("overview")

  const studentData = mockStudentData[studentId as keyof typeof mockStudentData]

  if (!studentData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-muted-foreground">Student Not Found</h1>
          <p className="text-muted-foreground mt-2">The student you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Needs Attention":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const initials = studentData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const tabs = [
    { id: "overview", label: "Overview", icon: IconUser },
    { id: "performance", label: "Performance", icon: IconChartBar },
    { id: "report", label: "Report Card", icon: IconFileText },
  ]

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-4 mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/teacher/students')}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Student Profile</h1>
            <p className="text-muted-foreground">
              {studentData.className} • Student ID: {studentData.studentId}
            </p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="px-4 lg:px-4 mb-4">
        <div className="border-0 shadow-none">
          <div className="py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{studentData.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <IconUser className="h-4 w-4" />
                    {studentData.studentId}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconSchool className="h-4 w-4" />
                    {studentData.className}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconCalendar className="h-4 w-4" />
                    DOB: {formatDate(studentData.dateOfBirth)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(studentData.status)}>
                  {studentData.status}
                </Badge>
                <div className="mt-2 text-sm">
                  <span className={`font-bold text-lg ${getScoreColor(studentData.averageScore)}`}>
                    {studentData.averageScore}%
                  </span>
                  <span className="text-muted-foreground"> avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Tab Navigation */}
      <div className="px-4 lg:px-4">
        <div className="border-b border-border">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Average Score</div>
                  <div className={`text-2xl font-bold ${getScoreColor(studentData.averageScore)}`}>
                    {studentData.averageScore}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Across {studentData.subjects.length} subjects
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Attendance Rate</div>
                  <div className="text-2xl font-bold">{studentData.attendance}%</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Overall attendance
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Total Subjects</div>
                  <div className="text-2xl font-bold">{studentData.subjects.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Active subjects
                  </div>
                </div>
              </div>

              {/* Subject Performance */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
                <div className="space-y-3">
                  {studentData.subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <IconClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subject.assessments} assessment{subject.assessments !== 1 ? 's' : ''} • Last updated {formatDate(subject.lastUpdated)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(subject.score)}`}>
                          {subject.score}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Grade {subject.grade}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Student</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <IconMail className="h-4 w-4 text-muted-foreground" />
                        <span>{studentData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconPhone className="h-4 w-4 text-muted-foreground" />
                        <span>{studentData.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Parent/Guardian</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <IconUser className="h-4 w-4 text-muted-foreground" />
                        <span>{studentData.parentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconPhone className="h-4 w-4 text-muted-foreground" />
                        <span>{studentData.parentPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconMail className="h-4 w-4 text-muted-foreground" />
                        <span>{studentData.parentEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div>
              <StudentPerformanceView />
            </div>
          )}

          {activeTab === "report" && (
            <div>
              <StudentResultsView />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
