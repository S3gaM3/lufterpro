import { useMemo, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Box, Button, Container, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4001/api',
  withCredentials: true,
})

function App() {
  const [token, setToken] = useState('')
  const [tab, setTab] = useState(0)
  const [auth, setAuth] = useState({ email: '', password: '' })
  const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token])

  const users = useQuery({
    queryKey: ['users', token],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/users', { headers: authHeader })).data as Array<{ id: number; email: string; role: string; status: string }>,
  })
  const categories = useQuery({
    queryKey: ['categories', token],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/categories', { headers: authHeader })).data as Array<{ id: number; name: string; slug: string; sortOrder: number; parentId: number | null }>,
  })
  const products = useQuery({
    queryKey: ['products', token],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/products', { headers: authHeader })).data as Array<{ id: number; name: string; slug: string; categoryId: number }>,
  })
  const banners = useQuery({
    queryKey: ['banners', token],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/banners', { headers: authHeader })).data as Array<{ id: number; title: string; startsAt: string; endsAt: string }>,
  })
  const content = useQuery({
    queryKey: ['content', token],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/content', { headers: authHeader })).data as Array<{ key: string; title: string; bodyHtml: string }>,
  })
  const logs = useQuery({
    queryKey: ['audit-logs', token],
    enabled: Boolean(token),
    queryFn: async () => (await api.get('/audit-logs', { headers: authHeader })).data as Array<{ id: number; action: string; entityType: string; createdAt: string }>,
  })

  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'editor' })
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' })
  const [newProduct, setNewProduct] = useState({ name: '', slug: '', categoryId: 0, price: 0 })
  const [newBanner, setNewBanner] = useState({ title: '', imageUrl: '', targetUrl: '', startsAt: '', endsAt: '' })
  const [contentForm, setContentForm] = useState({ key: 'home', title: 'Home', bodyHtml: '<p>Контент</p>' })
  const [categoryOrder, setCategoryOrder] = useState<number[]>([])

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: contentForm.bodyHtml,
    onUpdate: ({ editor: current }) => setContentForm((prev) => ({ ...prev, bodyHtml: current.getHTML() })),
  })

  async function login() {
    const response = await api.post('/auth/login', auth)
    setToken(response.data.accessToken)
  }

  async function createUser() {
    await api.post('/users', { ...newUser, status: 'active' }, { headers: authHeader })
    await users.refetch()
  }
  async function createCategory() {
    await api.post('/categories', { ...newCategory, parentId: null, sortOrder: (categories.data?.length ?? 0) + 1, isActive: true }, { headers: authHeader })
    await categories.refetch()
    setCategoryOrder((categories.data ?? []).map((item) => item.id))
  }
  async function createProduct() {
    await api.post('/products', {
      ...newProduct,
      shortDescription: '',
      fullDescriptionHtml: '',
      currency: 'RUB',
      stockStatus: 'in_stock',
      isActive: true,
      attributes: [],
      images: [],
    }, { headers: authHeader })
    await products.refetch()
  }
  async function createBanner() {
    await api.post('/banners', { ...newBanner, isActive: true, sortOrder: (banners.data?.length ?? 0) + 1 }, { headers: authHeader })
    await banners.refetch()
  }
  async function saveContent() {
    await api.post('/content', contentForm, { headers: authHeader })
    await content.refetch()
  }

  async function saveCategoryOrder(nextOrder: number[]) {
    const payload = nextOrder.map((id, index) => ({ id, sortOrder: index + 1, parentId: null }))
    await api.post('/categories/reorder', payload, { headers: authHeader })
    setCategoryOrder(nextOrder)
    await categories.refetch()
  }

  function handleCategoryDragEnd(event: DragEndEvent): void {
    if (!event.over || event.active.id === event.over.id) return
    const currentOrder = categoryOrder.length > 0 ? categoryOrder : (categories.data ?? []).map((item) => item.id)
    const oldIndex = currentOrder.indexOf(Number(event.active.id))
    const newIndex = currentOrder.indexOf(Number(event.over.id))
    if (oldIndex < 0 || newIndex < 0) return
    const next = arrayMove(currentOrder, oldIndex, newIndex)
    void saveCategoryOrder(next)
  }

  if (!token) {
    return (
      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>newlufter CMS</Typography>
          <Stack spacing={2}>
            <TextField label="Email" value={auth.email} onChange={(e) => setAuth((prev) => ({ ...prev, email: e.target.value }))} />
            <TextField type="password" label="Password" value={auth.password} onChange={(e) => setAuth((prev) => ({ ...prev, password: e.target.value }))} />
            <Button variant="contained" onClick={() => void login()}>Войти</Button>
          </Stack>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>CMS Admin Panel</Typography>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab label="Users" />
        <Tab label="Categories" />
        <Tab label="Products" />
        <Tab label="Banners" />
        <Tab label="Content" />
        <Tab label="Audit" />
      </Tabs>
      <Paper sx={{ p: 2, mt: 2 }}>
        {tab === 0 && (
          <Stack spacing={2}>
            <Typography variant="h6">Users</Typography>
            <Stack direction="row" spacing={1}>
              <TextField label="Email" value={newUser.email} onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} />
              <TextField label="Password" type="password" value={newUser.password} onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))} />
              <Select value={newUser.role} onChange={(e) => setNewUser((prev) => ({ ...prev, role: String(e.target.value) }))}>
                <MenuItem value="editor">editor</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
              </Select>
              <Button variant="contained" onClick={() => void createUser()}>Create</Button>
            </Stack>
            <pre>{JSON.stringify(users.data ?? [], null, 2)}</pre>
          </Stack>
        )}
        {tab === 1 && (
          <Stack spacing={2}>
            <Typography variant="h6">Categories (drag-and-drop order)</Typography>
            <Stack direction="row" spacing={1}>
              <TextField label="Name" value={newCategory.name} onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))} />
              <TextField label="Slug" value={newCategory.slug} onChange={(e) => setNewCategory((prev) => ({ ...prev, slug: e.target.value }))} />
              <Button variant="contained" onClick={() => void createCategory()}>Create</Button>
            </Stack>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
              <SortableContext
                items={(categoryOrder.length > 0 ? categoryOrder : (categories.data ?? []).map((item) => item.id))}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={1}>
                  {(categories.data ?? [])
                    .slice()
                    .sort((a, b) => {
                      const order = categoryOrder.length > 0 ? categoryOrder : (categories.data ?? []).map((item) => item.id)
                      return order.indexOf(a.id) - order.indexOf(b.id)
                    })
                    .map((category) => (
                      <SortableCategoryItem key={category.id} id={category.id} title={`${category.name} (${category.slug ?? category.id})`} />
                    ))}
                </Stack>
              </SortableContext>
            </DndContext>
          </Stack>
        )}
        {tab === 2 && (
          <Stack spacing={2}>
            <Typography variant="h6">Products (search/filter via API query)</Typography>
            <Stack direction="row" spacing={1}>
              <TextField label="Name" value={newProduct.name} onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))} />
              <TextField label="Slug" value={newProduct.slug} onChange={(e) => setNewProduct((prev) => ({ ...prev, slug: e.target.value }))} />
              <TextField label="Category ID" type="number" value={newProduct.categoryId} onChange={(e) => setNewProduct((prev) => ({ ...prev, categoryId: Number(e.target.value) }))} />
              <TextField label="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))} />
              <Button variant="contained" onClick={() => void createProduct()}>Create</Button>
            </Stack>
            <pre>{JSON.stringify(products.data ?? [], null, 2)}</pre>
          </Stack>
        )}
        {tab === 3 && (
          <Stack spacing={2}>
            <Typography variant="h6">Banners</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <TextField label="Title" value={newBanner.title} onChange={(e) => setNewBanner((prev) => ({ ...prev, title: e.target.value }))} />
              <TextField label="Image URL" value={newBanner.imageUrl} onChange={(e) => setNewBanner((prev) => ({ ...prev, imageUrl: e.target.value }))} />
              <TextField label="Target URL" value={newBanner.targetUrl} onChange={(e) => setNewBanner((prev) => ({ ...prev, targetUrl: e.target.value }))} />
              <TextField label="Starts ISO" value={newBanner.startsAt} onChange={(e) => setNewBanner((prev) => ({ ...prev, startsAt: e.target.value }))} />
              <TextField label="Ends ISO" value={newBanner.endsAt} onChange={(e) => setNewBanner((prev) => ({ ...prev, endsAt: e.target.value }))} />
              <Button variant="contained" onClick={() => void createBanner()}>Create</Button>
            </Stack>
            <pre>{JSON.stringify(banners.data ?? [], null, 2)}</pre>
          </Stack>
        )}
        {tab === 4 && (
          <Stack spacing={2}>
            <Typography variant="h6">Content (WYSIWYG)</Typography>
            <Stack direction="row" spacing={1}>
              <TextField label="Key" value={contentForm.key} onChange={(e) => setContentForm((prev) => ({ ...prev, key: e.target.value }))} />
              <TextField label="Title" value={contentForm.title} onChange={(e) => setContentForm((prev) => ({ ...prev, title: e.target.value }))} />
              <Button variant="contained" onClick={() => void saveContent()}>Save</Button>
            </Stack>
            <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1, minHeight: 180 }}>
              <EditorContent editor={editor} />
            </Box>
            <pre>{JSON.stringify(content.data ?? [], null, 2)}</pre>
          </Stack>
        )}
        {tab === 5 && (
          <Stack spacing={2}>
            <Typography variant="h6">Audit Logs (admin only)</Typography>
            <pre>{JSON.stringify(logs.data ?? [], null, 2)}</pre>
          </Stack>
        )}
      </Paper>
    </Container>
  )
}

export default App

function SortableCategoryItem({ id, title }: { id: number; title: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ddd',
    borderRadius: 8,
    padding: '10px 12px',
    background: '#fff',
    cursor: 'grab',
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {title}
    </div>
  )
}
