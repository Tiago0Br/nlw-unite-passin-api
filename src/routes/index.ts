import { checkIn } from './check-in'
import { createEvent } from './create-event'
import { getAttendeeBadge } from './get-attendee-badge'
import { getEvent } from './get-event'
import { getEventAttendees } from './get-event-attendees'
import { health } from './health'
import { registerForEvent } from './register-for-event'

export const routes = [
    health,
    createEvent,
    registerForEvent,
    getEvent,
    getAttendeeBadge,
    checkIn,
    getEventAttendees
]