"use client"

import { motion } from "framer-motion"
import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Mail,
  Database,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  Server,
  Network,
  KeyRound,
  AlertCircle,
  RefreshCw
} from "lucide-react"

const iconMap: Record<string, any> = {
  Shield,
  Lock,
  Eye,
  Users,
  Mail,
  Database,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  Server,
  Network,
  KeyRound,
  AlertCircle,
  RefreshCw
}

interface PolicySection {
  id: string
  type: string
  title?: string
  icon?: string
  content?: string
  intro?: string
  extra?: string
  footer?: string
  items?: any[]
  subsections?: any[]
  columns?: any[]
  metadata?: Record<string, string>
}

interface PolicyContentRendererProps {
  content: PolicySection[]
}

export function PolicyContentRenderer({ content }: PolicyContentRendererProps) {
  return (
    <div className="space-y-12">
      {content.map((section, index) => {
        const Icon = section.icon ? iconMap[section.icon] || FileText : FileText
        
        switch (section.type) {
          case 'promise':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="glass-card rounded-3xl p-8 md:p-12 text-center mb-16"
              >
                <div className="glass-button rounded-2xl p-4 inline-block mb-6">
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">
                  {section.title?.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="italic text-muted-foreground">{section.title?.split(' ').slice(-1)}</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {section.content}
                </p>
              </motion.div>
            )

          case 'section':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  )}
                  {section.extra && (
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Scope:</strong> {section.extra.replace('Scope: ', '')}
                    </p>
                  )}
                  {section.intro && (
                    <p className="text-muted-foreground leading-relaxed">{section.intro}</p>
                  )}
                  {section.subsections && section.subsections.map((subsection: any, subIndex: number) => (
                    <div key={subIndex}>
                      <h3 className="font-medium mb-3">{subsection.title}</h3>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        {subsection.items?.map((item: any, itemIndex: number) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>
                              <strong className="text-foreground">{item.label}:</strong> {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {section.items && !section.subsections && (
                    <ul className="space-y-2 text-muted-foreground">
                      {section.items.map((item: any, itemIndex: number) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>
                            {item.label ? (
                              <>
                                <strong className="text-foreground">{item.label}:</strong> {item.text}
                              </>
                            ) : (
                              item.text || item
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.footer && (
                    <p className="text-sm text-muted-foreground/70 mt-4">{section.footer}</p>
                  )}
                </div>
              </motion.div>
            )

          case 'security-grid':
          case 'security-controls':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
                  {section.intro && (
                    <p className="text-muted-foreground leading-relaxed">{section.intro}</p>
                  )}
                  <div className={section.type === 'security-grid' ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
                    {section.items?.map((item: any, itemIndex: number) => {
                      const ItemIcon = item.icon ? iconMap[item.icon] || Database : Database
                      return (
                        <div key={itemIndex} className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                          <div className="flex items-center gap-3 mb-3">
                            <ItemIcon className="w-4 h-4" />
                            <h4 className="font-medium">{item.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.text}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )

          case 'two-column':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
                  {section.intro && (
                    <p className="text-muted-foreground leading-relaxed">{section.intro}</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {section.columns?.map((column: any, colIndex: number) => {
                      const ColIcon = column.icon ? iconMap[column.icon] : FileText
                      const iconColorClass = column.iconColor === 'red' ? 'text-red-400' : 
                                            column.iconColor === 'green' ? 'text-green-400' : ''
                      return (
                        <div key={colIndex} className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <ColIcon className={`w-4 h-4 ${iconColorClass}`} />
                            {column.title}
                          </h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {column.items?.map((item: string, itemIndex: number) => (
                              <li key={itemIndex}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )

          case 'numbered-list':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
                  {section.intro && (
                    <p className="text-muted-foreground leading-relaxed">{section.intro}</p>
                  )}
                  <ul className="space-y-3 text-muted-foreground">
                    {section.items?.map((item: any, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <span className="font-mono text-sm bg-white/10 rounded px-2 py-0.5 mt-0.5">{itemIndex + 1}</span>
                        <span>
                          {item.label ? (
                            <>
                              <strong className="text-foreground">{item.label}:</strong> {item.text}
                            </>
                          ) : (
                            item.text || item
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )

          case 'bullet-list':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
                  {section.intro && (
                    <p className="text-muted-foreground leading-relaxed">{section.intro}</p>
                  )}
                  <ul className="space-y-2 text-muted-foreground">
                    {section.items?.map((item: any, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{typeof item === 'string' ? item : item.text || item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )

          case 'never-list':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8">
                  {section.intro && (
                    <p className="text-muted-foreground leading-relaxed mb-6">{section.intro}</p>
                  )}
                  <ul className="space-y-3 text-muted-foreground">
                    {section.items?.map((item: any, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <span className="text-red-400 mt-0.5">✕</span>
                        <span>{typeof item === 'string' ? item : item.text || item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )

          case 'rights-grid':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
                  {section.intro && (
                    <p className="text-muted-foreground leading-relaxed">{section.intro}</p>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    {section.items?.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                        <h4 className="font-medium mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  {section.footer && (
                    <p className="text-sm text-muted-foreground/70">{section.footer}</p>
                  )}
                </div>
              </motion.div>
            )

          case 'simple':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  )}
                  {section.extra && (
                    <p className="text-muted-foreground leading-relaxed">{section.extra}</p>
                  )}
                </div>
              </motion.div>
            )

          case 'policy-review':
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="glass-button rounded-xl p-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light">
                    {formatTitle(section.title)}
                  </h2>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                  )}
                  {section.metadata && (
                    <div className="bg-white/[0.03] rounded-xl p-5 border border-white/5">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Policy Owner</p>
                          <p className="font-medium">{section.metadata.policyOwner}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Review Frequency</p>
                          <p className="font-medium">{section.metadata.reviewFrequency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Review</p>
                          <p className="font-medium">{section.metadata.lastReview}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Review</p>
                          <p className="font-medium">{section.metadata.nextReview}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

function formatTitle(title?: string) {
  if (!title) return ''
  // Split numbered titles like "1. Purpose & Scope" into parts
  const parts = title.split(' ')
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1]
    const restParts = parts.slice(0, -1).join(' ')
    return (
      <>
        {restParts} <span className="italic text-muted-foreground">{lastPart}</span>
      </>
    )
  }
  return title
}
