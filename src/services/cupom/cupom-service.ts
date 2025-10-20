import { handleError } from '@/common/error.utils'
import apiClient from '../api-service'
// import { CategoryEntity, CreateCategoryDto, UpdateCategoryDto } from '@/common/types/category'
let tokenSession = sessionStorage.getItem('token')
class CupomService {
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
 createCupom(formData: any): Promise<any> {
    return this.handleRequest(
      apiClient.post('/cupom', formData, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to create cupom'
    );
  }

  getAllCupons(): Promise<any> {
    return this.handleRequest(
      apiClient.get('/cupom',{
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        }
      }),
      'Failed to fetch all cupons'
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


  deleteCupom(id: string): Promise<any> {
    return this.handleRequest(
      apiClient.delete(`/cupom/${id}`, {
        headers: {
          'Authorization': `Bearer ${tokenSession}`
        },
      }),
      'Failed to delete Empresa'
    )
  }


}

export default new CupomService()
