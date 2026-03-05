'use client'

import React, { useState } from 'react'
import { IS, ISCard, SchemaTree } from './ISShared'
import { useGlobalState } from '@/context/GlobalStateContext'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Operation {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  requestSchema?: SchemaField[]
  responseSchema?: SchemaField[]
}

interface SchemaField {
  name: string
  type: string
  required?: boolean
  children?: SchemaField[]
}

interface CanonicalDomain {
  id: string
  name: string
  icon: string
  description: string
  color: string
  operations: Operation[]
}

// ─── Method badge ─────────────────────────────────────────────────────────────
const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  GET:    { bg: `${IS.green}18`,  text: IS.green,  border: `${IS.green}35` },
  POST:   { bg: `${IS.blue}18`,   text: IS.blue,   border: `${IS.blue}35` },
  PUT:    { bg: `${IS.orange}18`, text: IS.orange, border: `${IS.orange}35` },
  PATCH:  { bg: `${IS.yellow}18`, text: IS.yellow, border: `${IS.yellow}35` },
  DELETE: { bg: `${IS.red}18`,    text: IS.red,    border: `${IS.red}35` },
}

function MethodBadge({ method }: { method: string }) {
  const c = METHOD_COLORS[method] ?? { bg: `${IS.muted}18`, text: IS.muted, border: `${IS.muted}35` }
  return (
    <span style={{
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 9px',
      borderRadius: '5px',
      backgroundColor: c.bg,
      border: `1px solid ${c.border}`,
      fontSize: '11px',
      fontWeight: 700,
      color: c.text,
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      minWidth: '54px',
      justifyContent: 'center',
    }}>
      {method}
    </span>
  )
}

// ─── Hardcoded catalog ────────────────────────────────────────────────────────
const CANONICAL_DOMAINS: CanonicalDomain[] = [
  {
    id: 'bms',
    name: 'BMS',
    icon: '🏢',
    description: 'Building Management System: HVAC, lighting, energy metering, and environmental control.',
    color: IS.blue,
    operations: [
      {
        id: 'bms.getZoneStatus',
        method: 'GET',
        path: '/bms/zones/{zoneId}/status',
        description: 'Retrieve current environmental status (temperature, humidity, CO2) for a building zone.',
        responseSchema: [
          { name: 'zoneId', type: 'string', required: true },
          { name: 'temperature', type: 'number', required: true },
          { name: 'humidity', type: 'number' },
          { name: 'co2ppm', type: 'number' },
          { name: 'hvacMode', type: 'string' },
          { name: 'timestamp', type: 'string', required: true },
        ],
      },
      {
        id: 'bms.setZoneSetpoint',
        method: 'PUT',
        path: '/bms/zones/{zoneId}/setpoint',
        description: 'Adjust temperature or lighting setpoint for a zone.',
        requestSchema: [
          { name: 'temperatureSetpoint', type: 'number' },
          { name: 'lightingLevel', type: 'number' },
          { name: 'requestedBy', type: 'string', required: true },
        ],
      },
      {
        id: 'bms.getEnergyMetrics',
        method: 'GET',
        path: '/bms/energy',
        description: 'Retrieve energy consumption metrics by floor or zone for a given period.',
        requestSchema: [
          { name: 'fromTs', type: 'string', required: true },
          { name: 'toTs', type: 'string', required: true },
          { name: 'floorId', type: 'string' },
        ],
      },
      {
        id: 'bms.listAlerts',
        method: 'GET',
        path: '/bms/alerts',
        description: 'List active BMS alerts with severity and affected zone information.',
      },
    ],
  },
  {
    id: 'av-vc',
    name: 'AV/VC',
    icon: '📡',
    description: 'Audiovisual and video conferencing resource control and meeting launch.',
    color: IS.purple,
    operations: [
      {
        id: 'avvc.startMeeting',
        method: 'POST',
        path: '/av/meetings/start',
        description: 'Launch a video conference session and return join link.',
        requestSchema: [
          { name: 'roomId', type: 'string', required: true },
          { name: 'hostId', type: 'string', required: true },
          { name: 'platform', type: 'string', required: true },
        ],
        responseSchema: [
          { name: 'meetingId', type: 'string', required: true },
          { name: 'joinUrl', type: 'string', required: true },
          { name: 'hostKey', type: 'string' },
        ],
      },
      {
        id: 'avvc.endMeeting',
        method: 'POST',
        path: '/av/meetings/{meetingId}/end',
        description: 'Terminate an active AV session and release room resources.',
      },
      {
        id: 'avvc.getRoomDevices',
        method: 'GET',
        path: '/av/rooms/{roomId}/devices',
        description: 'List all AV devices (displays, cameras, codecs) in a room.',
      },
      {
        id: 'avvc.setDisplayInput',
        method: 'PATCH',
        path: '/av/rooms/{roomId}/display',
        description: 'Switch the active input source on a room display.',
        requestSchema: [
          { name: 'inputSource', type: 'string', required: true },
        ],
      },
    ],
  },
  {
    id: 'iot-sensors',
    name: 'IoT Sensors',
    icon: '📶',
    description: 'Occupancy, environmental, and presence sensors for real-time space intelligence.',
    color: IS.cyan,
    operations: [
      {
        id: 'iot.getSensorReading',
        method: 'GET',
        path: '/iot/sensors/{sensorId}/reading',
        description: 'Retrieve the latest reading from a specific IoT sensor.',
        responseSchema: [
          { name: 'sensorId', type: 'string', required: true },
          { name: 'type', type: 'string', required: true },
          { name: 'value', type: 'number', required: true },
          { name: 'unit', type: 'string' },
          { name: 'timestamp', type: 'string', required: true },
        ],
      },
      {
        id: 'iot.listSensors',
        method: 'GET',
        path: '/iot/sensors',
        description: 'List all registered sensors filtered by floor, zone, or type.',
        requestSchema: [
          { name: 'floorId', type: 'string' },
          { name: 'zoneId', type: 'string' },
          { name: 'sensorType', type: 'string' },
        ],
      },
      {
        id: 'iot.getOccupancyHeatmap',
        method: 'GET',
        path: '/iot/occupancy/heatmap',
        description: 'Retrieve aggregated occupancy heatmap data for a floor and time range.',
        requestSchema: [
          { name: 'floorId', type: 'string', required: true },
          { name: 'fromTs', type: 'string', required: true },
          { name: 'toTs', type: 'string', required: true },
          { name: 'resolution', type: 'string' },
        ],
      },
    ],
  },
  {
    id: 'access-control',
    name: 'Access Control',
    icon: '🔐',
    description: 'Physical access rules, door events, and credential lifecycle management.',
    color: IS.purple,
    operations: [
      {
        id: 'ac.getAccessEvent',
        method: 'GET',
        path: '/access-control/events',
        description: 'Query access events filtered by door, badge, or time range.',
        requestSchema: [
          { name: 'fromTs', type: 'string', required: true },
          { name: 'toTs', type: 'string', required: true },
          { name: 'doorId', type: 'string' },
          { name: 'badgeId', type: 'string' },
        ],
      },
      {
        id: 'ac.grantAccess',
        method: 'POST',
        path: '/access-control/rules',
        description: 'Grant access to a door or zone for a given badge or group.',
        requestSchema: [
          { name: 'badgeId', type: 'string', required: true },
          { name: 'doorIds', type: 'array', required: true, children: [{ name: 'item', type: 'string' }] },
          { name: 'schedule', type: 'object', children: [
            { name: 'from', type: 'string' },
            { name: 'to', type: 'string' },
          ]},
        ],
      },
      {
        id: 'ac.revokeAccess',
        method: 'DELETE',
        path: '/access-control/rules/{ruleId}',
        description: 'Revoke an access rule immediately.',
      },
      {
        id: 'ac.listDoors',
        method: 'GET',
        path: '/access-control/doors',
        description: 'List all doors and access points managed by the connected system.',
      },
    ],
  },
  {
    id: 'digital-badge',
    name: 'Digital Badge',
    icon: '💳',
    description: 'Mobile and physical credential issuance, revocation, and NFC/BLE provisioning.',
    color: IS.gold,
    operations: [
      {
        id: 'badge.issueCredential',
        method: 'POST',
        path: '/badges/credentials',
        description: 'Issue a digital credential to a user for mobile or card-based access.',
        requestSchema: [
          { name: 'userId', type: 'string', required: true },
          { name: 'credentialType', type: 'string', required: true },
          { name: 'validFrom', type: 'string', required: true },
          { name: 'validUntil', type: 'string' },
          { name: 'accessGroups', type: 'array', children: [{ name: 'groupId', type: 'string' }] },
        ],
        responseSchema: [
          { name: 'credentialId', type: 'string', required: true },
          { name: 'provisioningUrl', type: 'string' },
          { name: 'status', type: 'string', required: true },
        ],
      },
      {
        id: 'badge.revokeCredential',
        method: 'DELETE',
        path: '/badges/credentials/{credentialId}',
        description: 'Revoke an active credential immediately across all readers.',
      },
      {
        id: 'badge.getCredential',
        method: 'GET',
        path: '/badges/credentials/{credentialId}',
        description: 'Retrieve credential details and current status.',
      },
      {
        id: 'badge.listCredentials',
        method: 'GET',
        path: '/badges/credentials',
        description: 'List all credentials for a user or access group.',
        requestSchema: [
          { name: 'userId', type: 'string' },
          { name: 'status', type: 'string' },
        ],
      },
    ],
  },
  {
    id: 'lockers',
    name: 'Lockers',
    icon: '🔒',
    description: 'Locker assignment, release, usage tracking, and OTP unlock flows.',
    color: IS.orange,
    operations: [
      {
        id: 'lockers.assignLocker',
        method: 'POST',
        path: '/lockers/assignments',
        description: 'Assign a locker to a user for a session or fixed duration.',
        requestSchema: [
          { name: 'lockerId', type: 'string', required: true },
          { name: 'userId', type: 'string', required: true },
          { name: 'durationMinutes', type: 'number' },
        ],
      },
      {
        id: 'lockers.releaseLocker',
        method: 'DELETE',
        path: '/lockers/assignments/{assignmentId}',
        description: 'Release a locker assignment and mark it as available.',
      },
      {
        id: 'lockers.unlockLocker',
        method: 'POST',
        path: '/lockers/{lockerId}/unlock',
        description: 'Send an OTP unlock command to a specific locker.',
        requestSchema: [
          { name: 'userId', type: 'string', required: true },
          { name: 'otp', type: 'string', required: true },
        ],
      },
      {
        id: 'lockers.getAvailability',
        method: 'GET',
        path: '/lockers/availability',
        description: 'Get current availability of lockers by floor or zone.',
      },
    ],
  },
  {
    id: 'ticketing',
    name: 'Ticketing',
    icon: '🎫',
    description: 'Facility issue tickets (Issue Reporting), SLA tracking, and ITSM bidirectional sync.',
    color: IS.red,
    operations: [
      {
        id: 'ticketing.createTicket',
        method: 'POST',
        path: '/ticketing/tickets',
        description: 'Submit a new facility issue ticket with category and priority.',
        requestSchema: [
          { name: 'reporterId', type: 'string', required: true },
          { name: 'category', type: 'string', required: true },
          { name: 'priority', type: 'string', required: true },
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'string' },
          { name: 'locationId', type: 'string' },
          { name: 'attachments', type: 'array', children: [{ name: 'url', type: 'string' }] },
        ],
        responseSchema: [
          { name: 'ticketId', type: 'string', required: true },
          { name: 'ticketNumber', type: 'string', required: true },
          { name: 'status', type: 'string', required: true },
          { name: 'externalRef', type: 'string' },
        ],
      },
      {
        id: 'ticketing.updateTicket',
        method: 'PUT',
        path: '/ticketing/tickets/{ticketId}',
        description: 'Update ticket status, assignee, or resolution notes.',
        requestSchema: [
          { name: 'status', type: 'string' },
          { name: 'assigneeId', type: 'string' },
          { name: 'resolution', type: 'string' },
        ],
      },
      {
        id: 'ticketing.getTicket',
        method: 'GET',
        path: '/ticketing/tickets/{ticketId}',
        description: 'Retrieve full ticket details including timeline and linked external record.',
      },
      {
        id: 'ticketing.listTickets',
        method: 'GET',
        path: '/ticketing/tickets',
        description: 'List tickets with optional filters for status, priority, and assignee.',
      },
    ],
  },
  {
    id: 'elevator',
    name: 'Elevator',
    icon: '🛗',
    description: 'Elevator destination dispatch, access control, and floor authorization.',
    color: IS.muted,
    operations: [
      {
        id: 'elevator.requestFloor',
        method: 'POST',
        path: '/elevator/dispatch',
        description: 'Request an elevator dispatch to a destination floor for a user.',
        requestSchema: [
          { name: 'userId', type: 'string', required: true },
          { name: 'destinationFloor', type: 'number', required: true },
          { name: 'liftGroupId', type: 'string' },
        ],
        responseSchema: [
          { name: 'dispatchId', type: 'string', required: true },
          { name: 'assignedCar', type: 'string' },
          { name: 'estimatedArrivalSeconds', type: 'number' },
        ],
      },
      {
        id: 'elevator.authorizeFloor',
        method: 'POST',
        path: '/elevator/authorizations',
        description: 'Temporarily authorize a user to access a specific floor via elevator.',
        requestSchema: [
          { name: 'userId', type: 'string', required: true },
          { name: 'floorIds', type: 'array', required: true, children: [{ name: 'item', type: 'number' }] },
          { name: 'validUntil', type: 'string' },
        ],
      },
      {
        id: 'elevator.getStatus',
        method: 'GET',
        path: '/elevator/cars/{carId}/status',
        description: 'Retrieve current status and floor position of an elevator car.',
      },
    ],
  },
  {
    id: 'visitor-management',
    name: 'Visitor Management',
    icon: '🏷️',
    description: 'Invitation lifecycle, check-in/out flows, badge printing, and ID verification.',
    color: IS.cyan,
    operations: [
      {
        id: 'vm.createInvitation',
        method: 'POST',
        path: '/visitors/invitations',
        description: 'Create a visitor invitation and send notification to the visitor.',
        requestSchema: [
          { name: 'visitorEmail', type: 'string', required: true },
          { name: 'visitorName', type: 'string', required: true },
          { name: 'hostId', type: 'string', required: true },
          { name: 'visitDate', type: 'string', required: true },
          { name: 'purpose', type: 'string' },
        ],
      },
      {
        id: 'vm.checkIn',
        method: 'PUT',
        path: '/visitors/invitations/{id}/check-in',
        description: 'Check a visitor in, capturing arrival time and issuing a badge.',
      },
      {
        id: 'vm.checkOut',
        method: 'PUT',
        path: '/visitors/invitations/{id}/check-out',
        description: 'Check a visitor out and invalidate their access badge.',
      },
      {
        id: 'vm.listVisitors',
        method: 'GET',
        path: '/visitors/invitations',
        description: 'List all visitor invitations with optional status filter.',
      },
    ],
  },
  {
    id: 'parking',
    name: 'Parking',
    icon: '🅿️',
    description: 'Parking space inventory, reservations, and real-time availability feeds.',
    color: IS.gold,
    operations: [
      {
        id: 'parking.createReservation',
        method: 'POST',
        path: '/parking/reservations',
        description: 'Reserve a parking space for a user on a given date and time window.',
        requestSchema: [
          { name: 'spaceId', type: 'string', required: true },
          { name: 'userId', type: 'string', required: true },
          { name: 'vehiclePlate', type: 'string', required: true },
          { name: 'date', type: 'string', required: true },
          { name: 'startTime', type: 'string', required: true },
          { name: 'endTime', type: 'string', required: true },
        ],
        responseSchema: [
          { name: 'reservationId', type: 'string', required: true },
          { name: 'status', type: 'string', required: true },
          { name: 'qrCode', type: 'string' },
        ],
      },
      {
        id: 'parking.cancelReservation',
        method: 'DELETE',
        path: '/parking/reservations/{reservationId}',
        description: 'Cancel an existing parking reservation and release the space.',
      },
      {
        id: 'parking.getAvailability',
        method: 'GET',
        path: '/parking/spaces/availability',
        description: 'Query real-time availability of parking spaces by zone and time slot.',
        requestSchema: [
          { name: 'date', type: 'string', required: true },
          { name: 'zone', type: 'string' },
          { name: 'spaceType', type: 'string' },
        ],
        responseSchema: [
          { name: 'spaces', type: 'array', children: [
            { name: 'spaceId', type: 'string' },
            { name: 'number', type: 'string' },
            { name: 'available', type: 'boolean' },
            { name: 'zone', type: 'string' },
          ]},
          { name: 'totalAvailable', type: 'number' },
        ],
      },
      {
        id: 'parking.listReservations',
        method: 'GET',
        path: '/parking/reservations',
        description: 'List all parking reservations with optional user or date filters.',
      },
    ],
  },
  {
    id: 'event-management',
    name: 'Event Management',
    icon: '🎪',
    description: 'Corporate event registration, capacity management, and attendee coordination.',
    color: IS.cyan,
    operations: [
      {
        id: 'events.createEvent',
        method: 'POST',
        path: '/events',
        description: 'Create a new corporate event with registration capacity and settings.',
        requestSchema: [
          { name: 'title', type: 'string', required: true },
          { name: 'startTime', type: 'string', required: true },
          { name: 'endTime', type: 'string', required: true },
          { name: 'locationId', type: 'string', required: true },
          { name: 'capacity', type: 'number', required: true },
          { name: 'registrationRequired', type: 'boolean' },
        ],
      },
      {
        id: 'events.registerAttendee',
        method: 'POST',
        path: '/events/{eventId}/attendees',
        description: 'Register an attendee for an event and issue a confirmation.',
        requestSchema: [
          { name: 'userId', type: 'string', required: true },
          { name: 'notes', type: 'string' },
        ],
      },
      {
        id: 'events.listAttendees',
        method: 'GET',
        path: '/events/{eventId}/attendees',
        description: 'List all registered attendees for an event.',
      },
      {
        id: 'events.cancelEvent',
        method: 'DELETE',
        path: '/events/{eventId}',
        description: 'Cancel an event and notify all registered attendees.',
      },
    ],
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    description: 'Canteen and restaurant menu, pre-ordering, payments, and meal plan management.',
    color: IS.orange,
    operations: [
      {
        id: 'restaurant.getMenu',
        method: 'GET',
        path: '/restaurant/menus',
        description: 'Retrieve the daily menu for a restaurant outlet.',
        requestSchema: [
          { name: 'outletId', type: 'string', required: true },
          { name: 'date', type: 'string', required: true },
        ],
        responseSchema: [
          { name: 'items', type: 'array', children: [
            { name: 'itemId', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'allergens', type: 'array', children: [{ name: 'item', type: 'string' }] },
          ]},
        ],
      },
      {
        id: 'restaurant.placeOrder',
        method: 'POST',
        path: '/restaurant/orders',
        description: 'Place a pre-order for a user for a specific meal slot.',
        requestSchema: [
          { name: 'userId', type: 'string', required: true },
          { name: 'outletId', type: 'string', required: true },
          { name: 'items', type: 'array', required: true, children: [
            { name: 'itemId', type: 'string' },
            { name: 'quantity', type: 'number' },
          ]},
          { name: 'pickupTime', type: 'string' },
        ],
      },
      {
        id: 'restaurant.cancelOrder',
        method: 'DELETE',
        path: '/restaurant/orders/{orderId}',
        description: 'Cancel an existing restaurant pre-order.',
      },
      {
        id: 'restaurant.getOrderStatus',
        method: 'GET',
        path: '/restaurant/orders/{orderId}',
        description: 'Retrieve current status and details of a placed order.',
      },
    ],
  },
  {
    id: 'waste-management',
    name: 'Waste Management',
    icon: '♻️',
    description: 'Waste container fill-level monitoring, collection scheduling, and reporting.',
    color: IS.green,
    operations: [
      {
        id: 'waste.getContainerStatus',
        method: 'GET',
        path: '/waste/containers/{containerId}/status',
        description: 'Retrieve current fill level and last emptied timestamp for a container.',
        responseSchema: [
          { name: 'containerId', type: 'string', required: true },
          { name: 'fillPercent', type: 'number', required: true },
          { name: 'wasteType', type: 'string', required: true },
          { name: 'lastEmptied', type: 'string' },
          { name: 'location', type: 'string' },
        ],
      },
      {
        id: 'waste.listContainers',
        method: 'GET',
        path: '/waste/containers',
        description: 'List all monitored waste containers with current fill levels.',
        requestSchema: [
          { name: 'floorId', type: 'string' },
          { name: 'wasteType', type: 'string' },
          { name: 'minFillPercent', type: 'number' },
        ],
      },
      {
        id: 'waste.scheduleCollection',
        method: 'POST',
        path: '/waste/collections',
        description: 'Schedule a waste collection job for one or more containers.',
        requestSchema: [
          { name: 'containerIds', type: 'array', required: true, children: [{ name: 'item', type: 'string' }] },
          { name: 'scheduledAt', type: 'string', required: true },
        ],
      },
    ],
  },
  {
    id: 'meeting-rooms',
    name: 'Meeting Rooms',
    icon: '📅',
    description: 'Room booking, no-show detection, calendar sync, occupancy, and equipment management.',
    color: IS.green,
    operations: [
      {
        id: 'mrb.createBooking',
        method: 'POST',
        path: '/spaces/bookings',
        description: 'Create a meeting room or desk booking linked to a calendar event.',
        requestSchema: [
          { name: 'spaceId', type: 'string', required: true },
          { name: 'organizerId', type: 'string', required: true },
          { name: 'title', type: 'string', required: true },
          { name: 'startTime', type: 'string', required: true },
          { name: 'endTime', type: 'string', required: true },
          { name: 'attendees', type: 'array', children: [{ name: 'email', type: 'string' }] },
        ],
      },
      {
        id: 'mrb.cancelBooking',
        method: 'DELETE',
        path: '/spaces/bookings/{bookingId}',
        description: 'Cancel a booking and optionally notify attendees.',
      },
      {
        id: 'mrb.checkOccupancy',
        method: 'GET',
        path: '/spaces/{spaceId}/occupancy',
        description: 'Query current occupancy sensor data for a space.',
      },
      {
        id: 'mrb.listAvailableSpaces',
        method: 'GET',
        path: '/spaces/available',
        description: 'Find available rooms or desks for a given time window and capacity.',
        requestSchema: [
          { name: 'startTime', type: 'string', required: true },
          { name: 'endTime', type: 'string', required: true },
          { name: 'capacity', type: 'number' },
          { name: 'features', type: 'array', children: [{ name: 'item', type: 'string' }] },
        ],
      },
      {
        id: 'mrb.reportNoShow',
        method: 'POST',
        path: '/spaces/bookings/{bookingId}/no-show',
        description: 'Mark a booking as a no-show and release the room for other users.',
      },
    ],
  },
]

// ─── Operation detail panel ───────────────────────────────────────────────────
function OperationDetail({
  op,
  domainName,
  impactConnectors,
}: {
  op: Operation
  domainName: string
  impactConnectors: string[]
}) {
  const [schemaTab, setSchemaTab] = useState<'request' | 'response'>('request')

  const hasRequest = op.requestSchema && op.requestSchema.length > 0
  const hasResponse = op.responseSchema && op.responseSchema.length > 0

  return (
    <div style={{
      backgroundColor: IS.pageBg,
      border: `1px solid ${IS.cardBorder}`,
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '8px',
    }}>
      {/* Operation header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${IS.cardBorder}`,
        backgroundColor: IS.cardBg2,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
      }}>
        <MethodBadge method={op.method} />
        <span style={{
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          color: IS.text,
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.01em',
        }}>
          {op.path}
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          color: IS.muted,
          fontSize: '12px',
          marginLeft: 'auto',
        }}>
          {op.description}
        </span>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Schema preview */}
        {(hasRequest || hasResponse) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Schema tab toggle */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {hasRequest && (
                <SchemaTabBtn active={schemaTab === 'request'} onClick={() => setSchemaTab('request')}>
                  Request Schema
                </SchemaTabBtn>
              )}
              {hasResponse && (
                <SchemaTabBtn active={schemaTab === 'response'} onClick={() => setSchemaTab('response')}>
                  Response Schema
                </SchemaTabBtn>
              )}
            </div>
            {schemaTab === 'request' && hasRequest && (
              <SchemaTree schema={op.requestSchema!} title={`${op.id} — Request`} />
            )}
            {schemaTab === 'response' && hasResponse && (
              <SchemaTree schema={op.responseSchema!} title={`${op.id} — Response`} />
            )}
            {schemaTab === 'request' && !hasRequest && (
              <div style={{ color: IS.muted, fontSize: '12px', padding: '8px', fontFamily: "'Inter', sans-serif" }}>
                No request body for this operation.
              </div>
            )}
            {schemaTab === 'response' && !hasResponse && (
              <div style={{ color: IS.muted, fontSize: '12px', padding: '8px', fontFamily: "'Inter', sans-serif" }}>
                No response schema defined.
              </div>
            )}
          </div>
        )}

        {/* Impact analysis */}
        <div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            color: IS.label,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            Impact Analysis — Connectors using {domainName}
          </div>
          {impactConnectors.length === 0 ? (
            <span style={{ fontFamily: "'Inter', sans-serif", color: IS.muted, fontSize: '12px' }}>
              No connectors currently mapped to this domain.
            </span>
          ) : (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {impactConnectors.map(name => (
                <span key={name} style={{
                  fontFamily: "'Inter', sans-serif",
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: `${IS.blue}18`,
                  border: `1px solid ${IS.blue}30`,
                  color: IS.blue,
                  fontSize: '12px',
                  fontWeight: 500,
                }}>
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SchemaTabBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Inter', sans-serif",
        padding: '5px 12px',
        borderRadius: '6px',
        background: active ? `${IS.blue}25` : 'transparent',
        border: `1px solid ${active ? IS.blue + '60' : IS.cardBorder}`,
        color: active ? IS.blue : IS.muted,
        fontSize: '12px',
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
}

// ─── Domain row (expandable) ──────────────────────────────────────────────────
function DomainRow({
  domain,
  impactConnectors,
}: {
  domain: CanonicalDomain
  impactConnectors: string[]
}) {
  const [expanded, setExpanded] = useState(false)
  const [selectedOp, setSelectedOp] = useState<string | null>(null)

  return (
    <div style={{
      border: `1px solid ${expanded ? domain.color + '40' : IS.cardBorder}`,
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease',
      backgroundColor: IS.cardBg,
    }}>
      {/* Domain header */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          background: expanded ? `${domain.color}10` : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.15s ease',
          borderBottom: expanded ? `1px solid ${IS.cardBorder}` : 'none',
        }}
      >
        {/* Color accent stripe */}
        <div style={{
          width: '4px',
          height: '36px',
          borderRadius: '3px',
          backgroundColor: domain.color,
          flexShrink: 0,
        }} />

        {/* Icon */}
        <span style={{ fontSize: '20px', flexShrink: 0 }}>{domain.icon}</span>

        {/* Name & description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            color: IS.textWhite,
            fontSize: '14px',
            fontWeight: 700,
          }}>
            {domain.name}
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            color: IS.muted,
            fontSize: '12px',
            marginTop: '2px',
          }}>
            {domain.description}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: IS.label,
          }}>
            {domain.operations.length} operation{domain.operations.length !== 1 ? 's' : ''}
          </span>
          {impactConnectors.length > 0 && (
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              color: IS.green,
              backgroundColor: `${IS.green}18`,
              border: `1px solid ${IS.green}30`,
              borderRadius: '12px',
              padding: '2px 8px',
            }}>
              {impactConnectors.length} connector{impactConnectors.length !== 1 ? 's' : ''}
            </span>
          )}
          {/* Chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={IS.muted}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'transform 0.2s ease', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Operations list */}
      {expanded && (
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {domain.operations.map(op => {
            const isSelected = selectedOp === op.id
            return (
              <div key={op.id}>
                <button
                  onClick={() => setSelectedOp(isSelected ? null : op.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    backgroundColor: isSelected ? `${IS.blue}18` : IS.cardBg2,
                    border: `1px solid ${isSelected ? IS.blue + '50' : IS.cardBorder}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                  }}
                >
                  <MethodBadge method={op.method} />
                  <span style={{
                    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                    color: IS.text,
                    fontSize: '12.5px',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {op.path}
                  </span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    color: IS.muted,
                    fontSize: '12px',
                    flexShrink: 0,
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {op.description}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={IS.muted}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: 'transform 0.15s ease', transform: isSelected ? 'rotate(180deg)' : 'none' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Detail panel */}
                {isSelected && (
                  <OperationDetail
                    op={op}
                    domainName={domain.name}
                    impactConnectors={impactConnectors}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Search bar ───────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke={IS.muted}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search domains or operations..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontFamily: "'Inter', sans-serif",
          width: '100%',
          padding: '9px 12px 9px 36px',
          backgroundColor: IS.inputBg,
          border: `1px solid ${focused ? IS.blue : IS.inputBorder}`,
          borderRadius: '8px',
          color: IS.text,
          fontSize: '13px',
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: focused ? `0 0 0 3px ${IS.blue}25` : 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ISCanonicalAPIs() {
  const { integrationConnectors } = useGlobalState()
  const [search, setSearch] = useState('')

  const totalOps = CANONICAL_DOMAINS.reduce((s, d) => s + d.operations.length, 0)

  const filteredDomains = search.trim()
    ? CANONICAL_DOMAINS.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase()) ||
        d.operations.some(
          op =>
            op.path.toLowerCase().includes(search.toLowerCase()) ||
            op.description.toLowerCase().includes(search.toLowerCase())
        )
      )
    : CANONICAL_DOMAINS

  // Map domain name -> connector names for impact analysis
  const connectorsByDomain = (domainName: string): string[] =>
    integrationConnectors
      .filter(c => c.domain.toLowerCase() === domainName.toLowerCase())
      .map(c => c.name)

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: IS.pageBg,
      minHeight: '100%',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* Header */}
      <div>
        <h2 style={{ color: IS.textWhite, fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
          Canonical API Catalog
        </h2>
        <p style={{ color: IS.muted, fontSize: '13px', margin: 0 }}>
          Read-only reference of canonical domain operations. These are the standard interfaces all connectors must implement.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Domains', value: CANONICAL_DOMAINS.length, color: IS.blue },
          { label: 'Operations', value: totalOps, color: IS.green },
          { label: 'Connectors', value: integrationConnectors.length, color: IS.purple },
        ].map(s => (
          <div key={s.label} style={{
            padding: '10px 18px',
            backgroundColor: IS.cardBg,
            border: `1px solid ${IS.cardBorder}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ color: s.color, fontSize: '22px', fontWeight: 700 }}>{s.value}</span>
            <span style={{ color: IS.label, fontSize: '13px' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Read-only notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        backgroundColor: `${IS.blue}10`,
        border: `1px solid ${IS.blue}25`,
        borderRadius: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={IS.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ color: IS.blue, fontSize: '12px', fontFamily: "'Inter', sans-serif" }}>
          This catalog is read-only. To propose changes to canonical APIs, raise a platform change request with the Integration Council.
        </span>
      </div>

      {/* Domain list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredDomains.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: IS.muted,
            fontSize: '13px',
            padding: '40px 20px',
            fontFamily: "'Inter', sans-serif",
          }}>
            No domains match &quot;{search}&quot;. Try a different search term.
          </div>
        ) : (
          filteredDomains.map(domain => (
            <DomainRow
              key={domain.id}
              domain={domain}
              impactConnectors={connectorsByDomain(domain.name)}
            />
          ))
        )}
      </div>
    </div>
  )
}
