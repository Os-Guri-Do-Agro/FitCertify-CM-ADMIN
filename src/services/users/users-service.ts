import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'

class userService {
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


  getAllUsersByGrupoAcessos(): Promise<any> {
    const token = sessionStorage.getItem('token')
    return this.handleRequest(
      apiClient.get('/user/grupoAcesso/listagem', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
      'Failed to fetch all users'
    )
  }

  getAllUsers(): Promise<any> {
    const token = sessionStorage.getItem('token')
    return this.handleRequest(
      apiClient.get('/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
      'Failed to fetch all users'
    )
  }

  createUserWithRole(data: any): Promise<any> {
    const token = sessionStorage.getItem('token')
    return this.handleRequest(
      apiClient.post('/user', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
      'Failed to fetch all users'
    )
  }

  validarExisteEmail(email: string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/user/validarExisteEmail?email=${email}`, {
      }),
      'ERROR - 404'
    )
  }

  inativarUsuario(id: string): Promise<any> {
    const token = sessionStorage.getItem('token')
    return this.handleRequest(
      apiClient.patch(`/user/admin/inativar/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }),
      'Failed to inactivate user'
    )
  }

}

export default new userService()
