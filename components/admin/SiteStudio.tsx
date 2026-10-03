'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, Check, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { uploadMenuImageAction } from '@/app/admin/menu/upload-image-action'
import { saveSiteSettingsAction } from '@/app/admin/site/actions'
import type { SiteSettings } from '@/lib/site-settings'
import styles from './SiteStudio.module.css'

type Tab = 'brand' | 'home' | 'story' | 'gallery' | 'contact' | 'marketing'
type Status = 'idle' | 'saving' | 'saved' | 'error'

const tabs: { id: Tab; number: string; label: string; description: string }[] = [
  { id: 'brand', number: '01', label: 'Thương hiệu', description: 'Tên, logo & bảng màu' },
  { id: 'home', number: '02', label: 'Trang chủ', description: 'Hero & các khu vực' },
  { id: 'story', number: '03', label: 'Câu chuyện', description: 'Giới thiệu & giá trị' },
  { id: 'gallery', number: '04', label: 'Thư viện ảnh', description: 'Khoảnh khắc của quán' },
  { id: 'contact', number: '05', label: 'Liên hệ', description: 'Địa chỉ & mạng xã hội' },
  { id: 'marketing', number: '06', label: 'Hiển thị & SEO', description: 'Thông báo & chia sẻ' },
]

function TextField({
  label, value, onChange, name, errors, hint, type = 'text', maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  name: string
  errors: Record<string, string>
  hint?: string
  type?: 'text' | 'email' | 'tel' | 'url'
  maxLength?: number
}) {
  const id = `site-${name.replaceAll('.', '-')}`
  const error = errors[name]
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={styles.input}
      />
      {hint && !error && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
      {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
    </div>
  )
}

function TextAreaField({
  label, value, onChange, name, errors, hint, rows = 4, maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  name: string
  errors: Record<string, string>
  hint?: string
  rows?: number
  maxLength?: number
}) {
  const id = `site-${name.replaceAll('.', '-')}`
  const error = errors[name]
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={styles.textarea}
      />
      {hint && !error && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
      {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
    </div>
  )
}

function ToggleField({
  label, description, checked, onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className={styles.toggleRow}>
      <span>
        <span className={styles.toggleLabel}>{label}</span>
        <span className={styles.toggleDescription}>{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className={styles.toggleInput}
      />
    </label>
  )
}

function ImageField({
  label, value, onChange, name, errors, hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  name: string
  errors: Record<string, string>
  hint?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const id = `site-upload-${name.replaceAll('.', '-')}`

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadError('')
    setUploading(true)
    try {
      const data = new FormData()
      data.set('file', file)
      const result = await uploadMenuImageAction(data)
      if ('error' in result) setUploadError(result.error)
      else onChange(result.url)
    } catch {
      setUploadError('Không thể tải ảnh lên. Vui lòng thử lại.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className={styles.imageField}>
      <div className={styles.imagePreview}>
        {value && (value.startsWith('/images/') || value.startsWith('https://')) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Xem trước ảnh được chọn" />
        ) : <ImagePlus aria-hidden="true" size={28} />}
      </div>
      <div className={styles.imageControls}>
        <TextField label={label} value={value} onChange={onChange} name={name} errors={errors} hint={hint} type="text" maxLength={2048} />
        <label htmlFor={id} className={styles.uploadLabel}>
          <ImagePlus size={16} aria-hidden="true" />
          {uploading ? 'Đang tải ảnh...' : 'Tải ảnh lên'}
          <input
            id={id}
            className={styles.fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={upload}
            disabled={uploading}
            aria-label={`Tải ảnh cho ${label.toLowerCase()}`}
          />
        </label>
        {uploadError && <p role="alert" className={styles.error}>{uploadError}</p>}
      </div>
    </div>
  )
}

function Section({
  number, title, description, children,
}: {
  number: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionNumber}>{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}

export function SiteStudio({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [lastSaved, setLastSaved] = useState<SiteSettings>(initialSettings)
  const [activeTab, setActiveTab] = useState<Tab>('brand')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isDirty = JSON.stringify(settings) !== JSON.stringify(lastSaved)

  function update<K extends keyof SiteSettings>(group: K, patch: Partial<SiteSettings[K]>) {
    setSettings((current) => ({ ...current, [group]: { ...current[group], ...patch } }))
    setStatus('idle')
    setMessage('')
    setErrors({})
  }

  function focusFirstError(fieldErrors: Record<string, string>) {
    const first = Object.keys(fieldErrors)[0]
    if (!first) return
    const tab = first.startsWith('brand.') || first.startsWith('theme.') ? 'brand'
      : first.startsWith('home.') ? 'home'
      : first.startsWith('story.') ? 'story'
      : first.startsWith('gallery.') ? 'gallery'
      : first.startsWith('contact.') ? 'contact' : 'marketing'
    setActiveTab(tab)
    requestAnimationFrame(() => document.getElementById(`site-${first.replaceAll('.', '-')}`)?.focus())
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('saving')
    setMessage('')
    setErrors({})
    try {
      const result = await saveSiteSettingsAction(settings)
      if (!result.ok) {
        setStatus('error')
        setMessage(result.message)
        setErrors(result.fieldErrors ?? {})
        if (result.fieldErrors) focusFirstError(result.fieldErrors)
        return
      }
      setLastSaved(settings)
      setStatus('saved')
      setMessage('Đã lưu. Giao diện công khai được cập nhật.')
    } catch {
      setStatus('error')
      setMessage('Không thể lưu thay đổi. Kiểm tra kết nối và thử lại.')
    }
  }

  function updateGalleryItem(index: number, patch: Partial<SiteSettings['gallery']['items'][number]>) {
    const items = settings.gallery.items.map((item, position) => position === index ? { ...item, ...patch } : item)
    update('gallery', { items })
  }

  function moveGalleryItem(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= settings.gallery.items.length) return
    const items = [...settings.gallery.items]
    ;[items[index], items[target]] = [items[target], items[index]]
    update('gallery', { items })
  }

  return (
    <div className={styles.studio}>
      <div className={styles.topline}>
        <div>
          <p className={styles.kicker}>{settings.brand.name} / ADMIN / WEBSITE STUDIO</p>
          <h1>Thiết kế trải nghiệm của quán.</h1>
          <p className={styles.intro}>Chỉnh nội dung, hình ảnh và diện mạo của website tại một nơi.</p>
        </div>
        <a className={styles.viewSite} href="/" target="_blank" rel="noopener noreferrer">
          Xem website <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>

      <form onSubmit={save} noValidate>
        <div className={styles.workspace}>
          <nav className={styles.sideNav} aria-label="Các mục tùy chỉnh website">
            <p className={styles.navEyebrow}>CẤU HÌNH WEBSITE</p>
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ''}`}
              >
                <span className={styles.navNumber}>{tab.number}</span>
                <span className={styles.navText}><strong>{tab.label}</strong><small>{tab.description}</small></span>
              </button>
            ))}
            <div className={styles.navFootnote}>Mọi thay đổi sẽ xuất hiện trên website sau khi lưu.</div>
          </nav>

          <div className={styles.editor}>
            {activeTab === 'brand' && <>
              <Section number="01 / 02" title="Bản sắc thương hiệu" description="Những chi tiết đầu tiên khách sẽ nhận ra ở quán.">
                <div className={styles.twoColumns}>
                  <TextField label="Tên thương hiệu" name="brand.name" value={settings.brand.name} onChange={(name) => update('brand', { name })} errors={errors} maxLength={100} />
                  <TextField label="Thông điệp ngắn" name="brand.tagline" value={settings.brand.tagline} onChange={(tagline) => update('brand', { tagline })} errors={errors} maxLength={160} />
                </div>
                <ImageField label="Logo (tùy chọn)" name="brand.logoUrl" value={settings.brand.logoUrl} onChange={(logoUrl) => update('brand', { logoUrl })} errors={errors} hint="Để trống nếu muốn dùng tên thương hiệu dạng chữ." />
              </Section>
              <Section number="02 / 02" title="Bảng màu" description="Chọn sắc độ tạo nên cảm giác của website.">
                <div className={styles.colorGrid}>
                  {([
                    ['background', 'Nền chính'], ['surface', 'Bề mặt'], ['ink', 'Màu chữ'], ['accent', 'Màu nhấn'], ['accentSoft', 'Màu nhấn phụ'],
                  ] as const).map(([key, label]) => (
                    <div key={key} className={styles.colorField}>
                      <label htmlFor={`site-theme-${key}`} className={styles.label}>{label}</label>
                      <div className={styles.colorInputWrap}>
                        <input type="color" aria-label={`Chọn ${label.toLowerCase()}`} value={settings.theme[key]} onChange={(event) => update('theme', { [key]: event.target.value })} className={styles.colorSwatch} />
                        <input id={`site-theme-${key}`} value={settings.theme[key]} maxLength={7} onChange={(event) => update('theme', { [key]: event.target.value })} aria-invalid={Boolean(errors[`theme.${key}`])} className={styles.colorValue} />
                      </div>
                      {errors[`theme.${key}`] && <p className={styles.error}>{errors[`theme.${key}`]}</p>}
                    </div>
                  ))}
                </div>
              </Section>
            </>}

            {activeTab === 'home' && <>
              <Section number="01 / 03" title="Ấn tượng đầu tiên" description="Câu chuyện mở đầu trên trang chủ.">
                <TextField label="Dòng giới thiệu nhỏ" name="home.eyebrow" value={settings.home.eyebrow} onChange={(eyebrow) => update('home', { eyebrow })} errors={errors} maxLength={120} />
                <TextField label="Tiêu đề chính" name="home.title" value={settings.home.title} onChange={(title) => update('home', { title })} errors={errors} maxLength={180} />
                <TextAreaField label="Mô tả" name="home.description" value={settings.home.description} onChange={(description) => update('home', { description })} errors={errors} maxLength={600} />
                <ImageField label="Ảnh chủ đạo" name="home.heroImageUrl" value={settings.home.heroImageUrl} onChange={(heroImageUrl) => update('home', { heroImageUrl })} errors={errors} />
                <TextField label="Mô tả ảnh cho người dùng trình đọc màn hình" name="home.heroImageAlt" value={settings.home.heroImageAlt} onChange={(heroImageAlt) => update('home', { heroImageAlt })} errors={errors} maxLength={200} />
                <div className={styles.twoColumns}>
                  <TextField label="Nút chính" name="home.primaryCtaLabel" value={settings.home.primaryCtaLabel} onChange={(primaryCtaLabel) => update('home', { primaryCtaLabel })} errors={errors} maxLength={80} />
                  <TextField label="Nút phụ" name="home.secondaryCtaLabel" value={settings.home.secondaryCtaLabel} onChange={(secondaryCtaLabel) => update('home', { secondaryCtaLabel })} errors={errors} maxLength={80} />
                </div>
              </Section>
              <Section number="02 / 03" title="Các khu vực trên trang" description="Bật hoặc tắt các phần nội dung theo nhu cầu.">
                <ToggleField label="Món nổi bật" description="Hiển thị các món được đánh dấu nổi bật trong quản lý menu." checked={settings.home.showFeatured} onChange={(showFeatured) => update('home', { showFeatured })} />
                <TextField label="Tiêu đề khu vực món nổi bật" name="home.featuredTitle" value={settings.home.featuredTitle} onChange={(featuredTitle) => update('home', { featuredTitle })} errors={errors} maxLength={120} />
                <ToggleField label="Câu chuyện ngắn" description="Một đoạn giới thiệu để dẫn khách đến trang câu chuyện." checked={settings.home.showStory} onChange={(showStory) => update('home', { showStory })} />
                <ToggleField label="Thư viện ảnh" description="Hiển thị những khoảnh khắc bạn thêm trong Thư viện ảnh." checked={settings.home.showGallery} onChange={(showGallery) => update('home', { showGallery })} />
                <TextField label="Tiêu đề thư viện ảnh" name="home.galleryTitle" value={settings.home.galleryTitle} onChange={(galleryTitle) => update('home', { galleryTitle })} errors={errors} maxLength={120} />
              </Section>
              <Section number="03 / 03" title="Đoạn giới thiệu" description="Nội dung ngắn trên trang chủ, tách biệt với trang giới thiệu đầy đủ.">
                <TextField label="Tiêu đề" name="home.storyTitle" value={settings.home.storyTitle} onChange={(storyTitle) => update('home', { storyTitle })} errors={errors} maxLength={160} />
                <TextAreaField label="Nội dung" name="home.storyText" value={settings.home.storyText} onChange={(storyText) => update('home', { storyText })} errors={errors} maxLength={800} />
                <ImageField label="Ảnh câu chuyện trên trang chủ" name="home.storyImageUrl" value={settings.home.storyImageUrl} onChange={(storyImageUrl) => update('home', { storyImageUrl })} errors={errors} />
              </Section>
            </>}

            {activeTab === 'story' && <>
              <Section number="01 / 02" title={`Câu chuyện của ${settings.brand.name}`} description="Nội dung trang Giới thiệu được kể bằng giọng riêng của bạn.">
                <TextField label="Dòng giới thiệu nhỏ" name="story.eyebrow" value={settings.story.eyebrow} onChange={(eyebrow) => update('story', { eyebrow })} errors={errors} maxLength={120} />
                <TextField label="Tiêu đề" name="story.title" value={settings.story.title} onChange={(title) => update('story', { title })} errors={errors} maxLength={180} />
                <TextAreaField label="Đoạn mở đầu" name="story.intro" value={settings.story.intro} onChange={(intro) => update('story', { intro })} errors={errors} maxLength={700} />
                <TextAreaField label="Câu chuyện đầy đủ" name="story.body" value={settings.story.body} onChange={(body) => update('story', { body })} errors={errors} rows={6} maxLength={3000} />
                <ImageField label="Ảnh trang giới thiệu" name="story.imageUrl" value={settings.story.imageUrl} onChange={(imageUrl) => update('story', { imageUrl })} errors={errors} />
                <TextField label="Mô tả ảnh" name="story.imageAlt" value={settings.story.imageAlt} onChange={(imageAlt) => update('story', { imageAlt })} errors={errors} maxLength={200} />
              </Section>
              <Section number="02 / 02" title="Giá trị của quán" description="Tối đa 6 ý ngắn để giới thiệu điều bạn theo đuổi.">
                {settings.story.values.map((value, index) => (
                  <div key={index} className={styles.listRow}>
                    <div className={styles.listField}><TextField label={`Giá trị ${index + 1}`} name={`story.values.${index}`} value={value} onChange={(next) => update('story', { values: settings.story.values.map((item, position) => position === index ? next : item) })} errors={errors} maxLength={160} /></div>
                    <button type="button" className={styles.iconButton} aria-label={`Xóa giá trị ${index + 1}`} onClick={() => update('story', { values: settings.story.values.filter((_, position) => position !== index) })}><Trash2 size={18} /></button>
                  </div>
                ))}
                {settings.story.values.length < 6 && <button type="button" className={styles.addButton} onClick={() => update('story', { values: [...settings.story.values, ''] })}><Plus size={17} aria-hidden="true" /> Thêm giá trị</button>}
              </Section>
            </>}

            {activeTab === 'gallery' && <Section number="01 / 01" title="Thư viện khoảnh khắc" description="Thêm tối đa 12 ảnh. Ảnh đầu tiên xuất hiện trước trên website.">
              {settings.gallery.items.length === 0 && <p className={styles.emptyState}>Chưa có ảnh nào. Thêm ảnh để kể câu chuyện của không gian quán.</p>}
              {settings.gallery.items.map((item, index) => (
                <div key={index} className={styles.galleryItem}>
                  <div className={styles.galleryItemHead}>
                    <strong>Ảnh {String(index + 1).padStart(2, '0')}</strong>
                    <div className={styles.galleryActions}>
                      <button type="button" className={styles.iconButton} onClick={() => moveGalleryItem(index, -1)} disabled={index === 0} aria-label={`Đưa ảnh ${index + 1} lên trước`}><ArrowUp size={17} /></button>
                      <button type="button" className={styles.iconButton} onClick={() => moveGalleryItem(index, 1)} disabled={index === settings.gallery.items.length - 1} aria-label={`Đưa ảnh ${index + 1} xuống sau`}><ArrowDown size={17} /></button>
                      <button type="button" className={styles.iconButton} onClick={() => update('gallery', { items: settings.gallery.items.filter((_, position) => position !== index) })} aria-label={`Xóa ảnh ${index + 1}`}><Trash2 size={17} /></button>
                    </div>
                  </div>
                  <ImageField label="Đường dẫn ảnh" name={`gallery.items.${index}.imageUrl`} value={item.imageUrl} onChange={(imageUrl) => updateGalleryItem(index, { imageUrl })} errors={errors} />
                  <div className={styles.twoColumns}>
                    <TextField label="Mô tả ảnh (bắt buộc)" name={`gallery.items.${index}.alt`} value={item.alt} onChange={(alt) => updateGalleryItem(index, { alt })} errors={errors} maxLength={200} />
                    <TextField label="Chú thích" name={`gallery.items.${index}.caption`} value={item.caption} onChange={(caption) => updateGalleryItem(index, { caption })} errors={errors} maxLength={160} />
                  </div>
                </div>
              ))}
              {settings.gallery.items.length < 12 && <button type="button" className={styles.addButton} onClick={() => update('gallery', { items: [...settings.gallery.items, { imageUrl: '', alt: '', caption: '' }] })}><Plus size={17} aria-hidden="true" /> Thêm ảnh</button>}
            </Section>}

            {activeTab === 'contact' && <>
              <Section number="01 / 02" title="Ghé thăm quán" description="Thông tin giúp khách tìm đường và liên hệ với quán.">
                <TextAreaField label="Địa chỉ" name="contact.address" value={settings.contact.address} onChange={(address) => update('contact', { address })} errors={errors} rows={2} maxLength={300} />
                <div className={styles.twoColumns}>
                  <TextField label="Số điện thoại" name="contact.phone" value={settings.contact.phone} onChange={(phone) => update('contact', { phone })} errors={errors} type="tel" maxLength={60} />
                  <TextField label="Email" name="contact.email" value={settings.contact.email} onChange={(email) => update('contact', { email })} errors={errors} type="email" maxLength={254} />
                </div>
                <TextField label="Giờ mở cửa" name="contact.hours" value={settings.contact.hours} onChange={(hours) => update('contact', { hours })} errors={errors} maxLength={240} />
                <TextField label="Liên kết Google Maps" name="contact.mapUrl" value={settings.contact.mapUrl} onChange={(mapUrl) => update('contact', { mapUrl })} errors={errors} hint="Dùng đường dẫn https://www.google.com/maps hoặc maps.google.com." maxLength={2048} />
              </Section>
              <Section number="02 / 02" title="Kết nối trên mạng xã hội" description="Để trống các kênh bạn chưa sử dụng.">
                <TextField label="Instagram" name="contact.instagram" value={settings.contact.instagram} onChange={(instagram) => update('contact', { instagram })} errors={errors} type="url" maxLength={2048} />
                <TextField label="Facebook" name="contact.facebook" value={settings.contact.facebook} onChange={(facebook) => update('contact', { facebook })} errors={errors} type="url" maxLength={2048} />
                <TextField label="TikTok" name="contact.tiktok" value={settings.contact.tiktok} onChange={(tiktok) => update('contact', { tiktok })} errors={errors} type="url" maxLength={2048} />
              </Section>
            </>}

            {activeTab === 'marketing' && <>
              <Section number="01 / 02" title="Thanh thông báo" description="Một thông điệp ngắn ở đầu trang khi có điều cần chia sẻ.">
                <ToggleField label="Hiện thanh thông báo" description="Có thể tắt bất cứ lúc nào mà vẫn giữ lại nội dung." checked={settings.announcement.enabled} onChange={(enabled) => update('announcement', { enabled })} />
                <TextField label="Nội dung thông báo" name="announcement.text" value={settings.announcement.text} onChange={(text) => update('announcement', { text })} errors={errors} maxLength={240} />
                <TextField label="Liên kết khi nhấn (tùy chọn)" name="announcement.href" value={settings.announcement.href} onChange={(href) => update('announcement', { href })} errors={errors} hint="Dùng đường dẫn nội bộ như /menu hoặc địa chỉ https://." maxLength={2048} />
              </Section>
              <Section number="02 / 02" title="Tìm kiếm & chia sẻ" description="Nội dung hiển thị trên Google và khi chia sẻ liên kết.">
                <TextField label="Tiêu đề website" name="seo.title" value={settings.seo.title} onChange={(title) => update('seo', { title })} errors={errors} maxLength={120} />
                <TextAreaField label="Mô tả website" name="seo.description" value={settings.seo.description} onChange={(description) => update('seo', { description })} errors={errors} rows={3} maxLength={300} />
                <TextField label="Địa chỉ website chính thức" name="seo.siteUrl" value={settings.seo.siteUrl} onChange={(siteUrl) => update('seo', { siteUrl })} errors={errors} hint="Địa chỉ HTTPS gốc cho canonical, sitemap và robots.txt." maxLength={2048} />
                <ImageField label="Ảnh khi chia sẻ liên kết" name="seo.ogImageUrl" value={settings.seo.ogImageUrl} onChange={(ogImageUrl) => update('seo', { ogImageUrl })} errors={errors} hint="Nếu để trống, website dùng ảnh chủ đạo của trang chủ." />
              </Section>
            </>}

            <div className={styles.saveBar}>
              <div className={`${styles.saveState} ${status === 'error' ? styles.saveStateError : ''}`} role="status" aria-live="polite">
                {status === 'saved' ? <Check size={18} aria-hidden="true" /> : <span className={styles.stateDot} />}
                {message || (isDirty ? 'Bạn có thay đổi chưa lưu.' : 'Nội dung đang ở phiên bản đã lưu.')}
              </div>
              <button type="submit" className={styles.saveButton} disabled={status === 'saving'}>
                {status === 'saving' ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

          <aside className={styles.previewColumn} aria-label="Xem trước trang chủ">
            <div className={styles.previewTop}><span className={styles.previewDot} /> LIVE PREVIEW <span className={styles.previewCaption}>TRANG CHỦ</span></div>
            <div className={styles.previewWindow} style={{ backgroundColor: settings.theme.background, color: settings.theme.ink }}>
              <div className={styles.previewHeader}>
                <strong>{settings.brand.name || 'Tên thương hiệu'}</strong>
                <span>MENU　 GIỚI THIỆU</span>
              </div>
              {settings.announcement.enabled && <div className={styles.previewAnnouncement} style={{ backgroundColor: settings.theme.accent, color: settings.theme.surface }}>{settings.announcement.text || 'Thông báo của bạn'}</div>}
              <div className={styles.previewImage}>
                {settings.home.heroImageUrl && (settings.home.heroImageUrl.startsWith('/images/') || settings.home.heroImageUrl.startsWith('https://')) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.home.heroImageUrl} alt="" />
                )}
              </div>
              <div className={styles.previewCopy}>
                <span style={{ color: settings.theme.accent }}>{settings.home.eyebrow || settings.brand.name}</span>
                <h3>{settings.home.title || 'Tiêu đề trang chủ'}</h3>
                <p>{settings.home.description || 'Mô tả trang chủ'}</p>
                <span className={styles.previewCta} style={{ backgroundColor: settings.theme.accent, color: settings.theme.surface }}>{settings.home.primaryCtaLabel || 'Khám phá'}</span>
              </div>
            </div>
            <p className={styles.previewNote}>Bản xem trước minh họa nội dung và màu sắc. Mở website để xem bố cục đầy đủ.</p>
          </aside>
        </div>
      </form>
    </div>
  )
}
