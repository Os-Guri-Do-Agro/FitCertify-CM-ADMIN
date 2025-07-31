export default interface IArtigo {
    foto: string
    ativo: boolean
    isMobile: boolean
    isDesktop: boolean
    createdAt: Date
    updatedAt: Date
    categoriaArtigoId: string | null
}
