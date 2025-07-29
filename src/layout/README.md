# Layout Components

Esta pasta contém todos os componentes relacionados ao layout principal da aplicação.

## Estrutura

### `DrawerNavigation.vue`
- **Função**: Navigation drawer lateral com menu de navegação
- **Características**:
  - Modo rail (compacto) e expandido
  - Perfil do usuário no topo
  - Menu principal com ícones
  - Footer com configurações e logout
  - Tema escuro com cor primária

### `AppBar.vue`
- **Função**: Barra superior da aplicação
- **Características**:
  - Título da aplicação
  - Botão de menu (se necessário)
  - Ações do usuário

### `ToolBars.vue`
- **Função**: Barras de ferramentas específicas para páginas
- **Status**: Em desenvolvimento

## Por que centralizar o layout aqui?

### 1. **Organização**
- Todos os componentes de layout ficam em um local específico
- Facilita manutenção e localização dos arquivos

### 2. **Reutilização**
- Componentes podem ser reutilizados em diferentes partes da aplicação
- Evita duplicação de código

### 3. **Consistência**
- Mantém padrão visual consistente em toda aplicação
- Facilita mudanças globais de design

### 4. **Separação de responsabilidades**
- Layout separado da lógica de negócio
- Componentes focados apenas na estrutura visual

## Como usar

```vue
<!-- App.vue -->
<template>
  <v-app>
    <v-layout>
      <DrawerNavigation />
      <AppBar />
      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>
```
