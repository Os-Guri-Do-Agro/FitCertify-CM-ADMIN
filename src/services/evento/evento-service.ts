import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
import { isSuperAdmin } from '@/utils/auth'

let tokenSession = sessionStorage.getItem('token')
class EventoService {
  private async handleRequest<T>(
    request: Promise<{ data: T }>,
    errorMessage: string
  ): Promise<T> {
    try {
      const { data } = await request
      return data
    } catch (error: any) {
      handleError(`${errorMessage}: ${error.message}`, error)
      throw error
    }
  }

  createEvento(formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.post('/evento', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to create evento'
    )
  }

  getAllEventosSuperAdmin(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/evento'),
      'Failed to fetch all eventos'
    )
  }

  getAllEventos(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/evento/backoffice', {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to fetch all eventos'
    )
  }

  getAllEventosAuto(): Promise<any> {
    return isSuperAdmin() ? this.getAllEventosSuperAdmin() : this.getAllEventos()
  }

  getEventoById(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/evento/${id}`),
      'Failed to fetch all evento'
    )
  }

  updateEvento(id: string, formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/evento/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to update evento '
    )
  }

  deleteEvento(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/evento/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${tokenSession}`,
        },
      }),
      'Failed to delete Evento'
    )
  }
}

export default new EventoService()
