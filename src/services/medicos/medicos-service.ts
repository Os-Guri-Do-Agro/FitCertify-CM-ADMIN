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

}


export default new medicosService()
