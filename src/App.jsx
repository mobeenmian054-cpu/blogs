import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router'
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiHeart, FiMenu, FiPenTool, FiSearch, FiX } from 'react-icons/fi'
import API_BASE_URL from './config'
import './App.css'

const API = `${API_BASE_URL}/api`
const dateLabel = (date) => date && !Number.isNaN(new Date(date).getTime())
  ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date)) : 'Recently'
const safeText = (value) => typeof value === 'string' ? value : ''
const excerptFor = (story) => safeText(story.excerpt) || safeText(story.content).slice(0, 165) + '…'

function readUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('storyNestUser') || 'null')
    return raw && typeof raw.token === 'string' ? raw : null
  } catch { return null }
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, options)
  let body = null
  try { body = await response.json() } catch { /* server may not return JSON */ }
  if (!response.ok) throw new Error(body?.message || `Request failed (${response.status})`)
  return body
}

function SiteHeader({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const linkClass = ({ isActive }) => isActive ? 'nav-link is-active' : 'nav-link'
  return <header className="site-header">
    <div className="site-container topbar">
      <Link className="brand" to="/" onClick={() => setOpen(false)} aria-label="Story Nest home"><span className="brand-icon">sn<span>.</span></span><span>Story Nest</span></Link>
      <nav id="primary-nav" className={open ? 'topnav is-open' : 'topnav'} aria-label="Main navigation">
        <NavLink end to="/" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/stories" className={linkClass} onClick={() => setOpen(false)}>Stories</NavLink>
        <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>Our idea</NavLink>
        <NavLink to="/write" className={linkClass} onClick={() => setOpen(false)}>Write</NavLink>
      </nav>
      <div className="header-actions">{user ? <><span className="header-username">Hi, {user.username}</span><button className="small-button" type="button" onClick={onLogout}>Log out</button></> : <><Link className="subtle-link" to="/login">Log in</Link><Link className="small-button small-button--accent" to="/register">Join Story Nest <FiArrowUpRight /></Link></>}</div>
      <button type="button" className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</button>
    </div>
  </header>
}

function StoryArtwork({ story, compact = false }) {
  return <div className={compact ? 'story-art story-art--compact' : 'story-art'}>
    {story.image ? <img src={story.image} alt={story.title ? `Cover art for ${story.title}` : 'Story cover'} loading="lazy" /> : <div className="story-art-fallback" aria-label="Story without a cover image"><span>STORY NEST / JOURNAL</span><strong>{safeText(story.title).slice(0, 50) || 'A story worth telling'}</strong><i>✳</i></div>}
  </div>
}

function StoryCard({ story, lead = false }) {
  return <article className={lead ? 'story-card story-card--lead' : 'story-card'}>
    <Link to={`/blog/${story._id}`} className="story-art-link" aria-label={`Read ${story.title}`}><StoryArtwork story={story} /></Link>
    <div className="story-card-body"><div className="story-meta"><span>STORY</span><span>{dateLabel(story.createdAt)}</span></div>
      <h3><Link to={`/blog/${story._id}`}>{story.title}</Link></h3>
      <p>{excerptFor(story)}</p>
      <div className="story-card-foot"><span>By {story.author || 'A writer'}</span><Link to={`/blog/${story._id}`} aria-label={`Open ${story.title}`}><FiArrowUpRight /></Link></div>
    </div>
  </article>
}

function useStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    request('/blogs').then(result => { if (active) setStories(Array.isArray(result) ? result : []) })
      .catch(err => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  return { stories, loading, error }
}

function StoryFeed({ heading = 'Stories from the community', home = false }) {
  const { stories, loading, error } = useStories()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const found = useMemo(() => {
    const filtered = stories.filter(item => `${safeText(item.title)} ${safeText(item.author)} ${safeText(item.excerpt)}`.toLowerCase().includes(query.trim().toLowerCase()))
    return [...filtered].sort((a, b) => sort === 'popular' ? (Number(b.likes) || 0) - (Number(a.likes) || 0) : new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  }, [stories, query, sort])
  return <section className="stories-section site-container" id="stories">
    <div className="section-kicker"><span className="ink-dash" /> THE READING ROOM</div>
    <div className="feed-heading"><h2>{heading}</h2><p>Words, ideas and perspectives, shared by people who love to write.</p></div>
    <div className="feed-controls"><label className="search-field"><FiSearch aria-hidden="true" /><span className="sr-only">Search stories</span><input type="search" placeholder="Search by title or writer" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label className="sort-field"><span className="sr-only">Sort stories</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="popular">Most liked</option></select></label></div>
    {loading ? <div className="empty-state" role="status">Opening the reading room…</div> : error ? <div className="empty-state" role="alert"><h3>We couldn't load the stories.</h3><p>Check the Story Nest API connection and try again.</p><small>{error}</small></div> : found.length ? <div className="stories-grid">{(home ? found.slice(0, 3) : found).map((story, index) => <StoryCard key={story._id} story={story} lead={home && index === 0} />)}</div> : <div className="empty-state"><h3>{query ? 'No matching stories yet.' : 'The first page is still unwritten.'}</h3><p>{query ? 'Try a different keyword.' : 'Be the first to share something worth reading.'}</p><Link className="text-link" to="/write">Write a story <FiArrowRight /></Link></div>}
    {home && found.length > 3 && <Link className="all-stories-link" to="/stories">Browse all stories <FiArrowRight /></Link>}
  </section>
}

function Home() {
  return <><section className="hero site-container"><div className="hero-copy"><p className="section-kicker"><span className="ink-dash" /> A HOME FOR GOOD STORIES</p><h1>Every story<br />starts <em>somewhere.</em></h1><p className="hero-subtitle">An open corner of the internet for honest writing, fresh perspectives and curious readers.</p><div className="hero-buttons"><Link className="button button-dark" to="/stories">Explore stories <FiArrowUpRight /></Link><Link className="button button-outline" to="/write">Share your story <FiPenTool /></Link></div><div className="hero-postscript">Built for people who have something to say.</div></div><div className="hero-illustration" aria-hidden="true"><span className="editorial-top">THE STORIES WE TELL / VOL. 01</span><div className="hero-title-art">The<br />written<br /><i>word.</i></div><div className="hero-illustration-mark">✳</div><div className="editorial-bottom"><span>PAUSE. READ. FEEL.</span><span>SN / 001</span></div></div></section><div className="strapline"><div className="site-container"><span>Read with curiosity.</span><span className="strapline-star">✳</span><span>Write with purpose.</span><span className="strapline-star">✳</span><span>Share your perspective.</span></div></div><StoryFeed heading="Fresh off the page" home /><section className="write-banner site-container"><div><p className="section-kicker">YOUR VOICE MATTERS</p><h2>Got something to tell?</h2><p>You don’t need to be a professional writer. Just start with your story.</p></div><Link className="button button-light" to="/write">Start writing <FiArrowUpRight /></Link></section></>
}

function Article({ user }) {
  const { id } = useParams()
  const [story, setStory] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [liked, setLiked] = useState(false)
  useEffect(() => { let active = true; request(`/blogs/${encodeURIComponent(id)}`).then(v => { if (active) setStory(v) }).catch(e => { if (active) setError(e.message) }).finally(() => { if (active) setLoading(false) }); return () => { active = false } }, [id])
  async function like() { if (liked) return; try {const result = await request(`/blogs/${encodeURIComponent(id)}/like`, {method:'POST'});setStory(s=>({...s,likes:result.likes}));setLiked(true)} catch(e){setError(e.message)} }
  async function addComment(event) { event.preventDefault(); if (!user || !comment.trim()) return; setSaving(true);setError('');try {const data = await request(`/blogs/${encodeURIComponent(id)}/comment`, {method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${user.token}`},body:JSON.stringify({text:comment.trim()})}); setStory(s=>({...s,comments:data}));setComment('')}catch(e){setError(e.message)}finally{setSaving(false)} }
  if (loading) return <div className="site-container article-state">Opening story…</div>
  if (!story) return <div className="site-container article-state" role="alert">Story unavailable. {error} <Link to="/stories">Return to stories</Link></div>
  return <article className="article-page site-container"><Link to="/stories" className="return-link"><FiArrowLeft /> Back to stories</Link><div className="article-heading"><p className="section-kicker">FROM THE READING ROOM <span>·</span> {dateLabel(story.createdAt)}</p><h1>{story.title}</h1><p>Written by {story.author || 'A writer'}</p></div><div className="article-cover"><StoryArtwork story={story} /></div><div className="article-content">{safeText(story.content).split(/\n\s*\n/).map((p,i) => <p key={i}>{p}</p>)}</div><div className="article-actions"><button type="button" onClick={like} disabled={liked} className={liked ? 'like-button liked' : 'like-button'}><FiHeart /> {story.likes || 0} {liked ? 'Liked' : 'Appreciate this story'}</button><span>Thanks for reading.</span></div><section className="comments"><h2>Conversation <span>({story.comments?.length || 0})</span></h2>{(story.comments || []).length ? story.comments.map((c,i)=><div className="comment" key={i}><strong>{c.user}</strong><p>{c.text}</p></div>) : <p className="muted">No comments yet. Start the conversation.</p>}{user ? <form className="comment-form" onSubmit={addComment}><label htmlFor="comment">Add your thought</label><textarea id="comment" value={comment} onChange={e=>setComment(e.target.value)} maxLength={1000} required placeholder="What stayed with you after reading?" /><button className="button button-dark" disabled={saving}>{saving ? 'Posting…' : 'Post comment'} <FiArrowRight /></button></form> : <p className="muted"><Link to="/login">Log in</Link> to join the conversation.</p>}{error && <p className="form-error" role="alert">{error}</p>}</section></article>
}

function AuthPage({ onLogin, register = false }) {
  const navigate = useNavigate()
  const [form,setForm] = useState({username:'', email:'',password:''})
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  async function submit(e) {e.preventDefault();setBusy(true);setError('');try{const data = await request(register ? '/users/register':'/users/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});onLogin(data);navigate('/write', {replace:true})}catch(err){setError(err.message)}finally{setBusy(false)}}
  return <main className="form-page site-container"><div className="form-intro"><p className="section-kicker">THE WRITERS' CORNER</p><h1>{register ? 'Make room for your words.' : 'Welcome back.'}</h1><p>{register ? 'Create an account and begin sharing your stories.' : 'Log in to continue writing and joining conversations.'}</p></div><form className="form-panel" onSubmit={submit}>{register && <label>Your name<input autoComplete="name" required minLength={2} maxLength={60} value={form.username} onChange={e=>setForm({...form,username:e.target.value})} /></label>}<label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></label><label>Password<input type="password" autoComplete={register?'new-password':'current-password'} minLength={8} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="button button-dark" disabled={busy}>{busy ? 'One moment…' : register ? 'Create account':'Log in'} <FiArrowRight /></button><p className="form-foot">{register?'Already a member?':'New around here?'} <Link to={register?'/login':'/register'}>{register?'Log in':'Create an account'}</Link></p></form></main>
}

function Write({ user }) {
  const navigate = useNavigate()
  const [data,setData] = useState({title:'',excerpt:'',content:''})
  const [cover,setCover] = useState(null)
  const [busy,setBusy] = useState(false)
  const [error,setError] = useState('')
  if (!user) return <Navigate to="/login" replace />
  async function submit(e) { e.preventDefault();setError('');if (cover && (!cover.type.startsWith('image/') || cover.size>5*1024*1024)){setError('Choose an image under 5 MB.');return}setBusy(true);const body=new FormData();body.append('title',data.title.trim());body.append('content',data.content.trim());body.append('excerpt',data.excerpt.trim());if(cover) body.append('image',cover);try{const result=await request('/blogs',{method:'POST',headers:{Authorization:`Bearer ${user.token}`},body});navigate(`/blog/${result._id}`)}catch(err){setError(err.message)}finally{setBusy(false)}}
  return <main className="write-page site-container"><div className="write-header"><p className="section-kicker">A BLANK PAGE, A FRESH START</p><h1>Your words, your way.</h1><p>Tell the story you’ve been meaning to share. You can always keep it simple.</p></div><form className="write-form" onSubmit={submit}><label>Story title<input required minLength={3} maxLength={160} placeholder="Give your story a name" value={data.title} onChange={e=>setData({...data,title:e.target.value})} /></label><label>Short introduction <small>(optional)</small><textarea rows={2} maxLength={240} placeholder="One or two lines to introduce your story" value={data.excerpt} onChange={e=>setData({...data,excerpt:e.target.value})} /></label><label>Your story<textarea rows={14} required minLength={20} maxLength={50000} placeholder="Start writing here…" value={data.content} onChange={e=>setData({...data,content:e.target.value})} /></label><label>Cover image <small>(optional · JPG, PNG or WebP · max 5 MB)</small><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setCover(e.target.files?.[0]||null)} /></label>{error && <p role="alert" className="form-error">{error}</p>}<div className="write-footer"><span>Publishing as {user.username}</span><button className="button button-dark" disabled={busy}>{busy?'Publishing…':'Publish story'} <FiArrowUpRight /></button></div></form></main>
}

function About() {return <main className="inner-page site-container"><p className="section-kicker">WHY STORY NEST EXISTS</p><h1>A little space for a lot of voices.</h1><div className="inner-page-copy"><p>Not every story needs a big audience. Sometimes it just needs a place to be written and someone willing to read it.</p><p>Story Nest is a simple publishing project where people can share ideas, personal experiences and what they've learned along the way. A small corner for writing that's honest and worth coming back to.</p><Link to="/stories" className="text-link">Take a look around <FiArrowRight /></Link></div></main>}
function Contact() {return <main className="inner-page site-container"><p className="section-kicker">GET IN TOUCH</p><h1>Have something on your mind?</h1><div className="inner-page-copy"><p>Questions about the project, a suggestion, or simply want to say hello? Send a note and start a conversation.</p><a className="button button-dark" href="mailto:mianmobeen13200@gmail.com?subject=Story%20Nest%20enquiry">Write an email <FiArrowUpRight /></a></div></main>}
function Footer() {return <footer className="footer"><div className="site-container footer-inner"><Link className="brand" to="/"><span className="brand-icon">sn<span>.</span></span><span>Story Nest</span></Link><p>A place for people and their stories.</p><div><Link to="/stories">Stories</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></div></div></footer>}

export default function App() {
  const [user,setUser] = useState(readUser)
  function signIn(data) {const session={_id:data._id,username:data.username,email:data.email,token:data.token};localStorage.setItem('storyNestUser',JSON.stringify(session));setUser(session)}
  function signOut(){localStorage.removeItem('storyNestUser');setUser(null)}
  return <div className="app-shell"><SiteHeader user={user} onLogout={signOut} /><Routes><Route path="/" element={<Home />} /><Route path="/stories" element={<StoryFeed heading="All stories" />} /><Route path="/showblogs" element={<Navigate to="/stories" replace />} /><Route path="/blog/:id" element={<Article user={user} />} /><Route path="/write" element={<Write user={user} />} /><Route path="/create" element={<Navigate to="/write" replace />} /><Route path="/login" element={user?<Navigate to="/write" replace/>:<AuthPage onLogin={signIn} />} /><Route path="/register" element={user?<Navigate to="/write" replace/>:<AuthPage onLogin={signIn} register />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<main className="inner-page site-container"><h1>We can't find that page.</h1><Link className="text-link" to="/">Back to Story Nest <FiArrowRight /></Link></main>} /></Routes><Footer /></div>
}
