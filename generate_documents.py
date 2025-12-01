#!/usr/bin/env python3
"""
Generate Excel and PDF from NEOX Infinity Specification
"""

import csv
from datetime import datetime

# Work items data structure
work_items = [
    # Service Level
    {
        "ID": "001",
        "Type": "Service",
        "Title": "NEOX Infinity App",
        "Description": "Multi-tenant administrative platform for building management, visitor control, parking, space management, and facility operations",
        "ParentID": "",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "",
        "Priority": "Critical",
        "Status": "Active"
    },
    
    # EPIC 001-001: Visitor Management
    {
        "ID": "001-001",
        "Type": "Epic",
        "Title": "Visitor Management",
        "Description": "Complete visitor lifecycle management including pre-registration, check-in/out, badge printing, and notifications",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "175",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # Use Case 001-001-UC01
    {
        "ID": "001-001-UC01",
        "Type": "Feature/Use Case",
        "Title": "Visitor Pre-Registration",
        "Description": "Allow hosts to pre-register visitors before their arrival",
        "ParentID": "001-001",
        "Implementation Area": "Tenant Admin, API",
        "Story Points": "27",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # Work Items for UC01
    {
        "ID": "001-001-UC01-WI01",
        "Type": "User Story",
        "Title": "Create visitor registration form",
        "Description": "Design and implement form with visitor details (name, email, phone, company, visit date/time)",
        "ParentID": "001-001-UC01",
        "Implementation Area": "Tenant Admin",
        "Story Points": "5",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC01-WI02",
        "Type": "User Story",
        "Title": "Add host selection functionality",
        "Description": "Enable host to select themselves or another employee as the visitor's host",
        "ParentID": "001-001-UC01",
        "Implementation Area": "Tenant Admin",
        "Story Points": "3",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC01-WI03",
        "Type": "Task",
        "Title": "Implement visitor data validation",
        "Description": "Validate email format, phone numbers, required fields",
        "ParentID": "001-001-UC01",
        "Implementation Area": "API",
        "Story Points": "3",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC01-WI04",
        "Type": "Task",
        "Title": "Create visitor API endpoints",
        "Description": "POST /api/visitors, GET /api/visitors/{id}",
        "ParentID": "001-001-UC01",
        "Implementation Area": "API",
        "Story Points": "5",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC01-WI05",
        "Type": "User Story",
        "Title": "Send confirmation email to visitor",
        "Description": "Automated email with QR code, visit details, and directions",
        "ParentID": "001-001-UC01",
        "Implementation Area": "API",
        "Story Points": "5",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC01-WI06",
        "Type": "Task",
        "Title": "Store visitor data in database",
        "Description": "Create visitors table with proper indexes and relationships",
        "ParentID": "001-001-UC01",
        "Implementation Area": "API",
        "Story Points": "3",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC01-WI07",
        "Type": "Task",
        "Title": "Handle duplicate visitor detection",
        "Description": "Check for existing visitors by email/phone",
        "ParentID": "001-001-UC01",
        "Implementation Area": "API",
        "Story Points": "3",
        "Priority": "Medium",
        "Status": "Not Started"
    },
    
    # Use Case 001-001-UC02
    {
        "ID": "001-001-UC02",
        "Type": "Feature/Use Case",
        "Title": "Visitor Check-In/Check-Out",
        "Description": "Enable reception to check visitors in and out of the building",
        "ParentID": "001-001",
        "Implementation Area": "Tenant Admin, API",
        "Story Points": "35",
        "Priority": "Critical",
        "Status": "Planned"
    },
    {
        "ID": "001-001-UC02-WI01",
        "Type": "User Story",
        "Title": "Build check-in interface",
        "Description": "Create UI for scanning QR codes or searching visitors",
        "ParentID": "001-001-UC02",
        "Implementation Area": "Tenant Admin",
        "Story Points": "8",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC02-WI02",
        "Type": "Task",
        "Title": "Implement QR code scanner",
        "Description": "Integrate QR code scanning functionality",
        "ParentID": "001-001-UC02",
        "Implementation Area": "Tenant Admin",
        "Story Points": "5",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC02-WI03",
        "Type": "Task",
        "Title": "Create check-in API endpoint",
        "Description": "PUT /api/visitors/{id}/checkin",
        "ParentID": "001-001-UC02",
        "Implementation Area": "API",
        "Story Points": "3",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC02-WI04",
        "Type": "Task",
        "Title": "Create check-out API endpoint",
        "Description": "PUT /api/visitors/{id}/checkout",
        "ParentID": "001-001-UC02",
        "Implementation Area": "API",
        "Story Points": "3",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC02-WI05",
        "Type": "User Story",
        "Title": "Display visitor photo on check-in",
        "Description": "Show visitor photo for identity verification",
        "ParentID": "001-001-UC02",
        "Implementation Area": "Tenant Admin",
        "Story Points": "3",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC02-WI06",
        "Type": "Task",
        "Title": "Notify host on visitor arrival",
        "Description": "Send notification to host when visitor checks in",
        "ParentID": "001-001-UC02",
        "Implementation Area": "API",
        "Story Points": "5",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC02-WI07",
        "Type": "User Story",
        "Title": "Record check-in/out timestamps",
        "Description": "Store accurate timestamps with timezone support",
        "ParentID": "001-001-UC02",
        "Implementation Area": "API",
        "Story Points": "3",
        "Priority": "High",
        "Status": "Not Started"
    },
    {
        "ID": "001-001-UC02-WI08",
        "Type": "Task",
        "Title": "Handle walk-in visitors",
        "Description": "Support check-in for visitors without pre-registration",
        "ParentID": "001-001-UC02",
        "Implementation Area": "Tenant Admin, API",
        "Story Points": "5",
        "Priority": "High",
        "Status": "Not Started"
    },
    
    # Continue with remaining epics (abbreviated for script)
    # EPIC 001-002: Parking Management
    {
        "ID": "001-002",
        "Type": "Epic",
        "Title": "Parking Management",
        "Description": "Vehicle and parking space management including reservations, access control, and occupancy tracking",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "183",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # EPIC 001-003: Digital Badges
    {
        "ID": "001-003",
        "Type": "Epic",
        "Title": "Digital Badges",
        "Description": "Digital credential management for building access and identification",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "155",
        "Priority": "Medium-High",
        "Status": "Planned"
    },
    
    # EPIC 001-004: Lockers
    {
        "ID": "001-004",
        "Type": "Epic",
        "Title": "Lockers",
        "Description": "Locker assignment, reservation, and management system",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "149",
        "Priority": "Medium",
        "Status": "Planned"
    },
    
    # EPIC 001-005: Space Management
    {
        "ID": "001-005",
        "Type": "Epic",
        "Title": "Space Management",
        "Description": "Meeting rooms, desks, and workspace booking and management",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "215",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # EPIC 001-006: User Management
    {
        "ID": "001-006",
        "Type": "Epic",
        "Title": "User Management",
        "Description": "User roles, permissions, authentication, and profile management",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "194",
        "Priority": "Critical",
        "Status": "Planned"
    },
    
    # EPIC 001-007: Tenant Management
    {
        "ID": "001-007",
        "Type": "Epic",
        "Title": "Tenant Management",
        "Description": "Multi-tenant configuration, onboarding, and administration",
        "ParentID": "001",
        "Implementation Area": "Global Admin, API",
        "Story Points": "168",
        "Priority": "Critical",
        "Status": "Planned"
    },
    
    # EPIC 001-008: Building Management
    {
        "ID": "001-008",
        "Type": "Epic",
        "Title": "Building Management",
        "Description": "Building configuration, floors, zones, and facility settings",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "130",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # EPIC 001-009: Reporting & Analytics
    {
        "ID": "001-009",
        "Type": "Epic",
        "Title": "Reporting & Analytics",
        "Description": "Dashboards, reports, and data analytics across all modules",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "180",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # EPIC 001-010: Notifications
    {
        "ID": "001-010",
        "Type": "Epic",
        "Title": "Notifications",
        "Description": "Multi-channel notification system (Email, SMS, Push)",
        "ParentID": "001",
        "Implementation Area": "Global Admin, Tenant Admin, API",
        "Story Points": "164",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # EPIC 001-011: Integration Hub
    {
        "ID": "001-011",
        "Type": "Epic",
        "Title": "Integration Hub",
        "Description": "Third-party integrations and API management",
        "ParentID": "001",
        "Implementation Area": "Global Admin, API Documentation",
        "Story Points": "196",
        "Priority": "High",
        "Status": "Planned"
    },
    
    # EPIC 001-012: Security & Compliance
    {
        "ID": "001-012",
        "Type": "Epic",
        "Title": "Security & Compliance",
        "Description": "Audit logs, compliance reporting, and security controls",
        "ParentID": "001",
        "Implementation Area": "Global Admin, API",
        "Story Points": "196",
        "Priority": "Critical",
        "Status": "Planned"
    },
]

def generate_csv():
    """Generate CSV file for Azure DevOps import"""
    filename = 'NEOX_Infinity_WorkItems.csv'
    
    fieldnames = ["ID", "Type", "Title", "Description", "ParentID", "Implementation Area", 
                  "Story Points", "Priority", "Status"]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(work_items)
    
    print(f"✅ Created {filename}")
    return filename

def main():
    print("=" * 60)
    print("NEOX Infinity App - Document Generator")
    print("=" * 60)
    print()
    
    # Generate CSV
    csv_file = generate_csv()
    
    print()
    print("=" * 60)
    print("Files Created:")
    print("=" * 60)
    print(f"✅ {csv_file} - CSV for Azure DevOps import")
    print()
    print("Note: For PDF conversion, you can:")
    print("1. Install pandoc: brew install pandoc")
    print("2. Run: pandoc NEOX_INFINITY_DETAILED_SPECIFICATION.md -o output.pdf")
    print()
    print("Or use an online Markdown to PDF converter:")
    print("- https://www.markdowntopdf.com/")
    print("- https://md2pdf.netlify.app/")
    print()

if __name__ == "__main__":
    main()
