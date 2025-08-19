import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'
let tokenSession = sessionStorage.getItem('token')
class EmpresaService {
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
 createEmpresa(formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.post('/empresa', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to create empresa'
    );
  }

  getAllEmpresas(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/empresa'),
      'Failed to fetch all empresas'
    )
  }


  getEmpresaById(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.get(`/empresa/${id}`),
      'Failed to fetch all empresa'
    )
  }

  updateEmpresa(id: string, formData: FormData): Promise<any> {
    return this.handleRequest(
      apiClient.patch(`/empresa/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to update empresa '
    );
  }


  deleteEmpresa(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/empresa/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to delete Empresa'
    )
  }


}

export default new EmpresaService()
