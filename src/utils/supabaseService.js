import { supabase } from '../lib/supabase';

// Generic CRUD service factory
export const createCrudService = (tableName) => ({
  // Create new record
  create: async (data) => {
    try {
      const { data: result, error } = await supabase
        ?.from(tableName)
        ?.insert([data])
        ?.select()
        ?.single()
      
      return { data: result, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Read records with optional filters
  read: async (options = {}) => {
    try {
      const { filters = [], orderBy, limit, select = '*' } = options
      let query = supabase?.from(tableName)?.select(select)

      // Apply filters
      filters?.forEach(({ column, operator, value }) => {
        query = query?.[operator]?.(column, value)
      })

      // Apply ordering
      if (orderBy) {
        query = query?.order(orderBy?.column, { ascending: orderBy?.ascending ?? true })
      }

      // Apply limit
      if (limit) {
        query = query?.limit(limit)
      }

      const { data, error } = await query
      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  },

  // Read single record by ID
  readById: async (id) => {
    try {
      const { data, error } = await supabase
        ?.from(tableName)
        ?.select('*')
        ?.eq('id', id)
        ?.single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Update record
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        ?.from(tableName)
        ?.update(updates)
        ?.eq('id', id)
        ?.select()
        ?.single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Delete record
  delete: async (id) => {
    try {
      const { error } = await supabase
        ?.from(tableName)
        ?.delete()
        ?.eq('id', id)
      
      return { error }
    } catch (error) {
      return { error: { message: 'Network error. Please try again.' } }
    }
  }
})

// Alumni-specific services
export const userProfileService = {
  ...createCrudService('user_profiles'),
  
  // Get alumni directory with filters
  getAlumniDirectory: async (filters = {}) => {
    try {
      let query = supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('is_active', true)
        ?.in('role', ['alumni', 'student', 'faculty'])

      if (filters?.department) {
        query = query?.eq('department', filters?.department)
      }
      if (filters?.graduationYear) {
        query = query?.eq('graduation_year', filters?.graduationYear)
      }
      if (filters?.location) {
        query = query?.ilike('location', `%${filters?.location}%`)
      }
      if (filters?.industry) {
        query = query?.ilike('industry', `%${filters?.industry}%`)
      }
      if (filters?.search) {
        query = query?.or(`full_name.ilike.%${filters?.search}%,company.ilike.%${filters?.search}%,current_position.ilike.%${filters?.search}%`)
      }

      const { data, error } = await query?.order('created_at', { ascending: false })
      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  },

  // Update user profile with auth context
  updateProfile: async (updates) => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: null, error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update({ ...updates, updated_at: new Date()?.toISOString() })
        ?.eq('id', user?.id)
        ?.select()
        ?.single()

      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  }
}

// Events service
export const eventsService = {
  ...createCrudService('events'),
  
  // Get upcoming public events
  getUpcomingEvents: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        ?.from('events')
        ?.select(`
          *,
          organizer:user_profiles!organizer_id(full_name, avatar_url),
          registrations:event_registrations(count)
        `)
        ?.eq('is_public', true)
        ?.eq('status', 'upcoming')
        ?.gte('start_date', new Date()?.toISOString())
        ?.order('start_date', { ascending: true })
        ?.limit(limit)

      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  },

  // Register for event
  registerForEvent: async (eventId) => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: null, error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('event_registrations')
        ?.insert([{
          event_id: eventId,
          user_id: user?.id,
          registration_data: {}
        }])
        ?.select()
        ?.single()

      if (!error) {
        // Update attendee count
        await supabase?.rpc('increment_attendee_count', { event_id: eventId })
      }

      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Get user's registered events
  getUserEvents: async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: [], error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('event_registrations')
        ?.select(`
          *,
          event:events(*)
        `)
        ?.eq('user_id', user?.id)
        ?.order('created_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  }
}

// Job postings service
export const jobsService = {
  ...createCrudService('job_postings'),
  
  // Get active job postings
  getActiveJobs: async (filters = {}) => {
    try {
      let query = supabase
        ?.from('job_postings')
        ?.select(`
          *,
          posted_by:user_profiles!posted_by(full_name, company, avatar_url)
        `)
        ?.eq('is_active', true)

      if (filters?.jobType) {
        query = query?.eq('job_type', filters?.jobType)
      }
      if (filters?.location) {
        query = query?.ilike('location', `%${filters?.location}%`)
      }
      if (filters?.company) {
        query = query?.ilike('company', `%${filters?.company}%`)
      }
      if (filters?.search) {
        query = query?.or(`title.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%,company.ilike.%${filters?.search}%`)
      }

      const { data, error } = await query?.order('created_at', { ascending: false })
      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  },

  // Apply for job
  applyForJob: async (jobId, applicationData) => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: null, error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('job_applications')
        ?.insert([{
          job_id: jobId,
          applicant_id: user?.id,
          ...applicationData
        }])
        ?.select()
        ?.single()

      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Get user's job applications
  getUserApplications: async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: [], error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('job_applications')
        ?.select(`
          *,
          job:job_postings(title, company, location, job_type)
        `)
        ?.eq('applicant_id', user?.id)
        ?.order('created_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  }
}

// Connections service
export const connectionsService = {
  ...createCrudService('user_connections'),

  // Send connection request
  sendConnectionRequest: async (requesteeId, message = '') => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: null, error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('user_connections')
        ?.insert([{
          requester_id: user?.id,
          requestee_id: requesteeId,
          status: 'pending',
          message
        }])
        ?.select()
        ?.single()

      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Accept connection request
  acceptConnection: async (connectionId) => {
    try {
      const { data, error } = await supabase
        ?.from('user_connections')
        ?.update({ status: 'connected', updated_at: new Date()?.toISOString() })
        ?.eq('id', connectionId)
        ?.select()
        ?.single()

      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Get user connections
  getUserConnections: async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: [], error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('user_connections')
        ?.select(`
          *,
          requester:user_profiles!requester_id(full_name, avatar_url, current_position, company),
          requestee:user_profiles!requestee_id(full_name, avatar_url, current_position, company)
        `)
        ?.or(`requester_id.eq.${user?.id},requestee_id.eq.${user?.id}`)
        ?.eq('status', 'connected')
        ?.order('updated_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  },

  // Get connection requests
  getConnectionRequests: async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: [], error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('user_connections')
        ?.select(`
          *,
          requester:user_profiles!requester_id(full_name, avatar_url, current_position, company, bio)
        `)
        ?.eq('requestee_id', user?.id)
        ?.eq('status', 'pending')
        ?.order('created_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  }
}

// Messages service
export const messagesService = {
  ...createCrudService('messages'),

  // Send message
  sendMessage: async (recipientId, subject, content) => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: null, error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('messages')
        ?.insert([{
          sender_id: user?.id,
          recipient_id: recipientId,
          subject,
          content
        }])
        ?.select()
        ?.single()

      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  },

  // Get user's messages (inbox)
  getInboxMessages: async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser()
      if (!user) {
        return { data: [], error: { message: 'Not authenticated' } }
      }

      const { data, error } = await supabase
        ?.from('messages')
        ?.select(`
          *,
          sender:user_profiles!sender_id(full_name, avatar_url)
        `)
        ?.eq('recipient_id', user?.id)
        ?.order('created_at', { ascending: false })

      return { data: data || [], error }
    } catch (error) {
      return { data: [], error: { message: 'Network error. Please try again.' } }
    }
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    try {
      const { data, error } = await supabase
        ?.from('messages')
        ?.update({ is_read: true })
        ?.eq('id', messageId)
        ?.select()
        ?.single()

      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Network error. Please try again.' } }
    }
  }
}

// Error handling utility
export const handleSupabaseError = (error, fallbackMessage = 'An error occurred') => {
  if (!error) return null

  // Network/connection errors
  if (error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('NetworkError') ||
      error?.name === 'TypeError' && error?.message?.includes('fetch')) {
    return 'Cannot connect to database. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
  }

  // Auth errors
  if (error?.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.'
  }

  if (error?.message?.includes('Email not confirmed')) {
    return 'Please check your email and confirm your account.'
  }

  // Validation errors
  if (error?.code === '23505') {
    return 'This record already exists. Please use different values.'
  }

  if (error?.code === '23503') {
    return 'Cannot perform this action due to related data.'
  }

  if (error?.code === '42501') {
    return 'You do not have permission to perform this action.'
  }

  return error?.message || fallbackMessage
}