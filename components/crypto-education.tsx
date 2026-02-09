"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Wallet, Shield, Zap, Globe, Info } from "lucide-react"

export function CryptoEducation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-accent" />
            What is Ethereum?
          </CardTitle>
          <CardDescription>Understanding the basics of cryptocurrency payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ethereum is a decentralized blockchain platform that enables secure, peer-to-peer transactions without
            intermediaries. When you pay with Ethereum, you're using digital currency (ETH) that's verified and recorded
            on a global network.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
              <Shield className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Secure</h4>
                <p className="text-xs text-muted-foreground">Cryptographic security protects your transactions</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
              <Zap className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Fast</h4>
                <p className="text-xs text-muted-foreground">Transactions complete in minutes, not days</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
              <Globe className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Global</h4>
                <p className="text-xs text-muted-foreground">Send payments anywhere in the world</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
              <Wallet className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Your Control</h4>
                <p className="text-xs text-muted-foreground">You own and control your digital assets</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Do I need a crypto wallet?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Yes, you'll need an Ethereum wallet to complete your purchase. We recommend Coinbase Wallet - it's
                secure, easy to use, and trusted by millions. Other popular options include Trust Wallet and Rainbow. These are digital wallets that store your cryptocurrency and allow
                you to send and receive payments.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I get Ethereum (ETH)?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                You can purchase ETH from cryptocurrency exchanges like Coinbase, Binance, or Kraken. Simply create an
                account, verify your identity, and buy ETH using your credit card or bank transfer. Then transfer the
                ETH to your personal wallet.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Are crypto payments safe?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Yes, when done correctly. Ethereum transactions are secured by blockchain technology and cryptography.
                Always verify the payment address, use reputable wallets, and never share your private keys or seed
                phrase with anyone.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>What are gas fees?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Gas fees are small transaction fees paid to the Ethereum network to process your payment. These fees
                vary based on network congestion and typically range from $1-$20. The fee goes to network validators,
                not to us.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can I get a refund?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Yes, refunds are processed back to your Ethereum wallet address. Blockchain transactions are
                irreversible, so we'll send a new transaction to return your funds. Refunds typically process within
                24-48 hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
