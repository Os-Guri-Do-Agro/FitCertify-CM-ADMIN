<template>
  <!-- Header Section -->
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-shield-account" class="me-3" size="large"></v-icon>
              Acessos
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todos as Acessos e Grupos de Acesso
            </p>
          </div>

          <v-btn @click="showUserDialog = true" color="primary" variant="elevated" size="large" elevation="2"
            rounded="lg">
            <v-icon start>mdi-account-plus</v-icon>
            Criar Usuário de acesso
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-avatar color="primary" class="me-3">
                <v-icon icon="mdi-file-document" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ CountActiveUsers }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total de Usuários
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-avatar color="success" class="me-3">
                <v-icon icon="mdi-check-circle" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">{{ CountAllUsers }}</div>
                <div class="text-caption text-medium-emphasis">
                  Total de Usuários Ativos
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Groups Access Expansion Panel -->
    <v-expansion-panels class="mb-6" elevation="3" rounded="lg">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-group" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Grupos de Acesso</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-data-table
            :headers="groupHeaders"
            :items="allGroups"
            :loading="loadingGroups"
            class="custom-table"
            hover
          >
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
            </template>

            <template v-slot:item.ativo="{ item }">
              <v-chip
                :color="item.ativo ? 'success' : 'warning'"
                :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-pause-circle'"
                size="small"
                variant="flat"
              >
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="openEditGroupDialog(item)"
              ></v-btn>
              <!-- <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="openDeleteGroupDialog(item)"
              ></v-btn> -->
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon icon="mdi-account-group-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <div class="text-h6 text-medium-emphasis mb-2">
                  Nenhum grupo encontrado
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Nenhum grupo de acesso cadastrado no sistema
                </div>
              </div>
            </template>
          </v-data-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Main Content Card -->
    <v-card class="main-card" elevation="3">
      <!-- Search Header -->
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
          <div class="d-flex align-center">
            <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Lista de Usuarios</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field v-model="search" density="comfortable" label="Buscar Usuarios..."
            prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line class="search-field"
            style="max-width: 300px"></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Data Table -->
      <v-data-table v-model:search="search" :filter-keys="['nome']" :headers="headers" :items="AllUsers"
        :loading="loading" class="custom-table" hover>
        <!-- Loading -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <!-- Avatar -->


        <template v-slot:item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'success' : 'warning'"
            :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>
        <template v-slot:item.ehAdmin="{ item }">
          <v-chip :color="item.ehAdmin ? 'success' : 'warning'"
            :prepend-icon="item.ehAdmin ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
            {{ item.ehAdmin ? 'Sim' : 'Não' }}
          </v-chip>
        </template>

        <!-- <template v-slot:item.atletaId="{ item }">
          <v-chip :color="item.atletaId ? 'success' : 'warning'"
            :prepend-icon="item.atletaId ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
            {{ item.atletaId ? 'Sim' : 'Não' }}
          </v-chip>
        </template>
        <template v-slot:item.medicoId="{ item }">
          <v-chip :color="item.medicoId ? 'success' : 'warning'"
            :prepend-icon="item.medicoId ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
            {{ item.medicoId ? 'Sim' : 'Não' }}
          </v-chip>
        </template> -->

        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.ativo && !isCurrentUser(item.id)"
            icon="mdi-account-off"
            size="small"
            color="warning"
            variant="text"
            @click="openInactivateDialog(item)"
          >
          </v-btn>
          <v-tooltip v-else-if="item.ativo && isCurrentUser(item.id)" text="Você não pode inativar a si mesmo">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-account-off"
                size="small"
                color="grey"
                variant="text"
                disabled
              >
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <!-- No data -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon icon="mdi-newspaper-variant-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhum usuário encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Nenhum usuário cadastrado no sistema
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- User Creation Dialog -->
  <v-dialog v-model="showUserDialog" max-width="600" persistent>
    <v-card class="user-dialog">
      <v-card-title class="dialog-header pa-6">
        <div class="d-flex align-center">
          <div class="avatar-container me-4">
            <v-avatar color="primary" size="48">
              <v-icon color="white" size="24">mdi-account-plus</v-icon>
            </v-avatar>
          </div>
          <div>
            <h3 class="text-h5 mb-1 font-weight-bold">Criar Novo Usuário</h3>
            <p class="text-body-2 text-medium-emphasis mb-0">Defina as informações e permissões do usuário</p>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="userForm">
          <div class="form-grid">
            <div class="form-section">
              <div class="section-header mb-4">
                <v-icon color="primary" class="me-2">mdi-account</v-icon>
                <h4 class="section-title">Informações Pessoais</h4>
              </div>

              <v-text-field
                v-model="newUser.nome"
                label="Nome Completo"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required]"
                required
              ></v-text-field>

              <v-text-field
                v-model="newUser.email"
                label="Email"
                type="email"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.email]"
                :error-messages="emailErrorMessage"
                @blur="checkEmailExists"
                required
              ></v-text-field>

              <v-text-field
                v-model="newUser.cpf"
                label="CPF"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                :rules="[rules.cpf]"
                required
              ></v-text-field>

              <v-alert
                type="info"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                <v-icon start>mdi-key</v-icon>
                <strong>Senha de primeiro acesso:</strong> @Senha + os 3 primeiros dígitos do CPF
              </v-alert>
            </div>

            <div class="form-section">
              <div class="section-header mb-4">
                <v-icon color="primary" class="me-2">mdi-shield-account</v-icon>
                <h4 class="section-title">Permissões e Acesso</h4>
              </div>

              <v-select
                v-model="newUser.subRole"
                :items="roleOptions"
                item-title="label"
                item-value="value"
                label="Função do Usuário"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required]"
                required
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" class="role-item">
                    <template v-slot:prepend>
                      <v-avatar size="32" :color="item.raw.color" class="me-3">
                        <v-icon :icon="item.raw.icon" color="white" size="16"></v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium">{{ item.raw.label }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">{{ item.raw.description }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>

              <div class="permission-cards">
                <v-card variant="tonal" color="info" class="pa-4">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="info" class="me-2">mdi-information</v-icon>
                    <span class="text-subtitle-2 font-weight-medium">Informações da Função</span>
                  </div>
                  <p class="text-caption mb-0" v-if="selectedRoleInfo">
                    {{ selectedRoleInfo.description }}
                  </p>
                  <p class="text-caption mb-0" v-else>
                    Selecione uma função para ver as permissões
                  </p>
                </v-card>
              </div>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-btn variant="outlined" @click="closeDialog" class="me-3" size="large">
          <v-icon start>mdi-close</v-icon>
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="elevated"
          @click="createUser"
          :loading="creating"
          :disabled="!isFormValid || creating"
          size="large"
        >
          <v-icon start>mdi-check</v-icon>
          Criar Usuário
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="inactivateDialog" max-width="400" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="warning" class="me-2">mdi-account-off</v-icon>
        Inativar Usuário
      </v-card-title>

      <v-card-text>
        <p>Tem certeza que deseja inativar o usuário <strong>{{ selectedUser?.nome }}</strong>?</p>
        <p class="text-caption text-grey">Esta ação pode ser revertida posteriormente.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="inactivateDialog = false" :disabled="inactivating">
          Cancelar
        </v-btn>
        <v-btn
          color="warning"
          @click="confirmInactivate"
          :loading="inactivating"
        >
          Inativar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Group Confirmation Dialog -->

  <!-- <v-dialog v-model="showDeleteGroupDialog" max-width="400" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="error" class="me-2">mdi-delete</v-icon>
        Excluir Grupo de Acesso
      </v-card-title>

      <v-card-text>
        <p>Tem certeza que deseja excluir o grupo <strong>{{ selectedGroup?.nome }}</strong>?</p>
        <p class="text-caption text-grey">Esta ação não pode ser desfeita.</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showDeleteGroupDialog = false" :disabled="deletingGroup">
          Cancelar
        </v-btn>
        <v-btn
          color="error"
          @click="confirmDeleteGroup"
          :loading="deletingGroup"
        >
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

  <!-- Edit Group Dialog -->
  <v-dialog v-model="showEditGroupDialog" max-width="500" persistent>
    <v-card>
      <v-card-title class="pa-6">
        <div class="d-flex align-center">
          <v-icon icon="mdi-pencil" class="me-2" color="primary"></v-icon>
          <span class="text-h6">Editar Grupo de Acesso</span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-form ref="groupForm">
          <v-text-field
            v-model="editGroup.nome"
            label="Nome"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-text-field
            v-model="editGroup.descricao"
            label="Descrição"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="[rules.required]"
            required
          ></v-text-field>

          <v-switch
            v-model="editGroup.ativo"
            label="Ativo"
            color="primary"
            inset
            disabled
          ></v-switch>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-btn variant="outlined" @click="closeEditGroupDialog">
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="elevated"
          @click="editarGrupoAcesso"
          :loading="editingGroup"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import usersService from '@/services/users/users-service'
import grupoAcessoService from '@/services/grupoAcesso/grupoAcesso-service'
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getInfoUser, isSuperAdmin, getGrupoAcessoId } from '@/utils/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
// const router = useRouter()
const search = ref('')
const AllUsers = ref<any[]>([])
const loading = ref(true)
const dialog = ref(false)
const inactivateDialog = ref(false)
const selectedUser = ref<any>(null)
const inactivating = ref(false)
const CountActiveUsers = ref()
const CountAllUsers = ref()
const showUserDialog = ref(false)
const creating = ref(false)
const userForm = ref<any>(null)
const emailExists = ref(false)
const emailErrorMessage = ref('')

// Groups variables
const allGroups = ref<any[]>([])
const loadingGroups = ref(true)
const showEditGroupDialog = ref(false)
const showDeleteGroupDialog = ref(false)
const selectedGroup = ref<any>(null)
const editingGroup = ref(false)
const deletingGroup = ref(false)
const groupForm = ref<any>(null)

const editGroup = ref({
  nome: '',
  descricao: '',
  ativo: true
})

const newUser = ref({
  nome: '',
  email: '',
  cpf: '',
  ehAdmin: true,
  senha: '',
  subRole: ''
})

const rules = {
  required: (value: any) => !!value || 'Campo obrigatório',
  email: (value: string) => {
    if (!value) return 'Email é obrigatório'
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email inválido'
  },
  cpf: (value: string) => {
    if (!value) return 'CPF é obrigatório'
    const cpf = value.replace(/\D/g, '')
    if (cpf.length !== 11) return 'CPF deve ter 11 dígitos'
    if (/^(\d)\1{10}$/.test(cpf)) return 'CPF inválido'

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0

    if (parseInt(cpf.charAt(9)) !== digit1 || parseInt(cpf.charAt(10)) !== digit2) {
      return 'CPF inválido'
    }
    return true
  }
}

const roleOptions = [
  {
    value: 'admin',
    label: 'Administrador',
    icon: 'mdi-shield-crown',
    color: 'purple',
    description: 'Acesso total ao sistema, pode gerenciar todos os módulos e usuários'
  },
  // {
  //   value: 'financeiro',
  //   label: 'Financeiro',
  //   icon: 'mdi-bank',
  //   color: 'green',
  //   description: 'Gestão financeira, cupons e assinaturas'
  // },
  // {
  //   value: 'marketing',
  //   label: 'Marketing',
  //   icon: 'mdi-chart-donut-variant',
  //   color: 'orange',
  //   description: 'Campanhas de marketing e auditoria de dados'
  // },
  {
    value: 'organizador',
    label: 'Organizador',
    icon: 'mdi-calendar-multiple',
    color: 'blue',
    description: 'Gestão de eventos e organizações esportivas'
  },
  {
    value: 'blog',
    label: 'Editor de Blog',
    icon: 'mdi-post-outline',
    color: 'teal',
    description: 'Criação e gestão de artigos do blog'
  },
  {
    value: 'marketplace',
    label: 'Marketplace',
    icon: 'mdi-shopping-outline',
    color: 'indigo',
    description: 'Gestão de empresas e marketplace'
  },
]

const selectedRoleInfo = computed(() => {
  return roleOptions.find(role => role.value === newUser.value.subRole)
})

const isFormValid = computed(() => {
  const { nome, email, cpf, subRole } = newUser.value

  // Check if all fields are filled
  if (!nome || !email || !cpf || !subRole) return false

  // Check if email exists
  if (emailExists.value) return false

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) return false

  // Validate CPF
  const cleanCpf = cpf.replace(/\D/g, '')
  if (cleanCpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false

  return true
})

const closeDialog = () => {
  showUserDialog.value = false
  newUser.value = {
    nome: '',
    email: '',
    cpf: '',
    ehAdmin: true,
    senha: '',
    subRole: ''
  }
  userForm.value?.resetValidation()
  emailExists.value = false
  emailErrorMessage.value = ''
}

const checkEmailExists = async () => {
  if (!newUser.value.email || rules.email(newUser.value.email) !== true) {
    emailErrorMessage.value = ''
    return
  }

  try {
    const response = await usersService.validarExisteEmail(newUser.value.email)
    if (response.data.existeEmail) {
      emailErrorMessage.value = response.data.message
    } else {
      emailErrorMessage.value = ''
    }
  } catch (error) {
    console.error('Erro ao validar email:', error)
  }
}

const openEditGroupDialog = (group: any) => {
  selectedGroup.value = group
  editGroup.value = {
    nome: group.nome,
    descricao: group.descricao,
    ativo: group.ativo
  }
  showEditGroupDialog.value = true
}

const closeEditGroupDialog = () => {
  showEditGroupDialog.value = false
  selectedGroup.value = null
  editGroup.value = {
    nome: '',
    descricao: '',
    ativo: true
  }
  groupForm.value?.resetValidation()
}

const openDeleteGroupDialog = (group: any) => {
  selectedGroup.value = group
  showDeleteGroupDialog.value = true
}

const confirmDeleteGroup = async () => {
  if (!selectedGroup.value) return

  deletingGroup.value = true
  try {
    console.log('Deletando grupo:', selectedGroup.value.id)
    await grupoAcessoService.deleteGrupoAcesso(selectedGroup.value.id)

    // Remove from local array
    const index = allGroups.value.findIndex(g => g.id === selectedGroup.value.id)
    if (index !== -1) {
      allGroups.value.splice(index, 1)
    }
    toast.success('Grupo excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir grupo:', error)
    toast.error('Erro ao excluir grupo')
  } finally {
    deletingGroup.value = false
    showDeleteGroupDialog.value = false
    selectedGroup.value = null
  }
}

const editarGrupoAcesso = async () => {
  if (!selectedGroup.value) return

  const { valid } = await groupForm.value.validate()
  if (!valid) return

  editingGroup.value = true
  try {
    await grupoAcessoService.editGrupoAcesso(selectedGroup.value.id, {
      nome: editGroup.value.nome,
      descricao: editGroup.value.descricao,
      ativo: editGroup.value.ativo
    })

    // Update local array
    const index = allGroups.value.findIndex(g => g.id === selectedGroup.value.id)
    if (index !== -1) {
      allGroups.value[index] = { ...allGroups.value[index], ...editGroup.value }
    }

    toast.success('Grupo editado com sucesso!')
  } catch (error) {
    console.error('Erro ao editar grupo:', error)
    toast.error('Erro ao editar grupo')
  } finally {
    editingGroup.value = false
    closeEditGroupDialog()
  }
}

let emailTimeout:any

// Watch email changes to disable button
watch(() => newUser.value.email, async (newEmail) => {
  emailExists.value = false
  emailErrorMessage.value = ''

  if (!newEmail || rules.email(newEmail) !== true) return

  clearTimeout(emailTimeout)
  emailTimeout = setTimeout(async () => {
    try {
      const response = await usersService.validarExisteEmail(newEmail)
      emailExists.value = response.data.existeEmail
    } catch (error) {
      console.error('Erro ao validar email:', error)
    }
  }, 500)
})

const createUser = async () => {
  if (!isFormValid.value) return
  if (CountAllUsers.value >= 5 ) {
    toast.error('Seu grupo de acesso já atingiu o limite de usuários')
    return
  }

  const { valid } = await userForm.value.validate()
  if (!valid) return

  creating.value = true
  newUser.value.senha = '@Senha'+ newUser.value.cpf.replace(/\D/g, '').slice(0, 3)

  try {
    await usersService.createUserWithRole(newUser.value)
    toast.success('Usuário criado com sucesso!')
    closeDialog()
    await loadUsers()
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    toast.error('Erro ao criar usuário')
  } finally {
    creating.value = false
  }
}
const headers = [
  { title: 'Grupo', key: 'grupoAcessoNome' },
  { title: 'Nome', key: 'nome' },
  { title: 'CPF', key: 'cpf' },
  { title: 'Email', key: 'email' },
  { title: 'Ativo', key: 'ativo' },
  { title: 'Função', key: 'subRole' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const groupHeaders = [
  { title: 'Nome', key: 'nome' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Ativo', key: 'ativo' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const loadUsers = async () => {
  loading.value = true
  try {
    const response = await usersService.getAllUsersByGrupoAcessos()
    CountActiveUsers.value = response.data.filter((e: any) => e.ativo == true).length
    CountAllUsers.value = response.data.length
    AllUsers.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  } finally {
    loading.value = false
  }
}

const loadGrupoAcesso = async () => {
  loadingGroups.value = true
  try {
    if (isSuperAdmin()) {
      const response = await grupoAcessoService.getAllGrupoAcesso()
      allGroups.value = response.data || []
      return response.data
    } else {
      const response = await grupoAcessoService.getAllGrupoAcessoById(getGrupoAcessoId())
      const groups = Array.isArray(response.data) ? response.data : [response.data]
      allGroups.value = groups || []
      return groups
    }
  } catch (error) {
    console.error('Erro ao carregar grupos:', error)
  } finally {
    loadingGroups.value = false
  }
}

onMounted(() => {
  loadUsers()
  loadGrupoAcesso()
})

const formatCPF = (cpf: string) => {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return cpf
}

const isCurrentUser = (userId: string) => {
  const currentUser = getInfoUser()
  return currentUser?.userId === userId
}

const openInactivateDialog = (user: any) => {
  selectedUser.value = user
  inactivateDialog.value = true
}

const confirmInactivate = async () => {
  if (!selectedUser.value) return

  inactivating.value = true
  try {
    await usersService.inativarUsuario(selectedUser.value.id)
    selectedUser.value.ativo = false
    inactivateDialog.value = false
    selectedUser.value = null
  } catch (error) {
    console.error('Erro ao inativar usuário:', error)
  } finally {
    inactivating.value = false
  }
}
</script>

<style scoped>
.header-content {
  flex: 1;
}

.create-btn {
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stats-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.main-card {
  border-radius: 16px;
  overflow: hidden;
}

.search-field {
  transition: all 0.3s ease;
}

.custom-table {
  border-radius: 0;
}

.custom-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.article-title {
  max-width: 150px;
}
</style>
