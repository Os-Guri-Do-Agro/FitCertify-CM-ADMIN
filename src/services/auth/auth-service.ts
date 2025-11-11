import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import { tokenToString } from 'typescript'
// import type IArtigo from '@/Interfaces/artigo-interface'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'
let tokenSession = sessionStorage.getItem('token')
class AuthService {
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

  login(data: any): Promise<any> {
    return this.handleRequest(
      apiClient.post('/auth/login-admin', data

      ),
      'Failed to fetch all categories'
    )

  }


  validarCodigoEmail(data: { token: string, codigo: string }): Promise<any> {
    return this.handleRequest(
      apiClient.post(`/auth/validar-codigo-email`, data, {
      }),
      'ERROR - 404'
    )
  }



  enviarCodigo(email: string): Promise<any> {
    return this.handleRequest(
      apiClient.post(`/auth/enviar-codigo-email?email=${email}&isAdmin=false&isCmAdmin=true&isMobile=false`),
      'Erro ao enviar email de redefinição de senha'
    )
  }


  forgotPassword(data: { token: string, codigo: string, senhaNova: string }): Promise<any> {
    return this.handleRequest(
      apiClient.post(`/auth/forgot-password`, data, {
      }),
      'ERROR - 404'
    )
  }
  forgotPasswordLogado(data: any): Promise<any> {
    return this.handleRequest(
      apiClient.post(`/auth/forgot-password-logado`, data, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'ERROR - 404'
    )
  }



  validarToken(token: string): Promise<any> {
    return this.handleRequest(
      apiClient.post(`/auth/validar-token?token=${token}`, {
      }),
      'ERROR - 404'
    )
  }


}


export default new AuthService()
