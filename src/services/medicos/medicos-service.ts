import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'


let tokenSession = sessionStorage.getItem('token')
class medicosService {
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

  getAllMedicos(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/medico', {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to fetch all users'
    )
  }

  getAllMedicoInativos(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/medico/inativos', {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to fetch all users'
    )
  }

  patchMedicosInativos(id: string, data: any): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/medico/inativos/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to patch all doctors'
    )
  }

  patchAtivarLoteMedicos(id: string[], data: any): Promise<any> {
    return this.handleRequest(
      apiClient.patch('/medico/toggleStatusEmLote', data, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to patch all doctors'
    )
  }

}


export default new medicosService()
