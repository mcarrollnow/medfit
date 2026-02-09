"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Atom,
  Dna,
  Database,
  FileText,
  Plus,
  Download,
  Upload,
  Trash2,
  Sparkles,
  AlertCircle,
  Search,
  Loader2,
} from "lucide-react"
import { MoleculeViewer3D } from "./molecule-viewer-3d"
import { PeptideStructure2DEnhanced } from "./peptide-structure-2d-enhanced"

type AminoAcid = {
  code: string
  name: string
  abbreviation: string
}

type PeptideSequence = {
  id: string
  name: string
  sequence: string
  molecularWeight: number
  notes: string
}

type ResearchNote = {
  id: string
  title: string
  content: string
  peptideId?: string
  timestamp: Date
}

const aminoAcids: AminoAcid[] = [
  { code: "A", name: "Alanine", abbreviation: "Ala" },
  { code: "C", name: "Cysteine", abbreviation: "Cys" },
  { code: "D", name: "Aspartic Acid", abbreviation: "Asp" },
  { code: "E", name: "Glutamic Acid", abbreviation: "Glu" },
  { code: "F", name: "Phenylalanine", abbreviation: "Phe" },
  { code: "G", name: "Glycine", abbreviation: "Gly" },
  { code: "H", name: "Histidine", abbreviation: "His" },
  { code: "I", name: "Isoleucine", abbreviation: "Ile" },
  { code: "K", name: "Lysine", abbreviation: "Lys" },
  { code: "L", name: "Leucine", abbreviation: "Leu" },
  { code: "M", name: "Methionine", abbreviation: "Met" },
  { code: "N", name: "Asparagine", abbreviation: "Asn" },
  { code: "P", name: "Proline", abbreviation: "Pro" },
  { code: "Q", name: "Glutamine", abbreviation: "Gln" },
  { code: "R", name: "Arginine", abbreviation: "Arg" },
  { code: "S", name: "Serine", abbreviation: "Ser" },
  { code: "T", name: "Threonine", abbreviation: "Thr" },
  { code: "V", name: "Valine", abbreviation: "Val" },
  { code: "W", name: "Tryptophan", abbreviation: "Trp" },
  { code: "Y", name: "Tyrosine", abbreviation: "Tyr" },
]

export function PeptideResearchTools() {
  const [activeTab, setActiveTab] = React.useState("builder")
  const [viewerSequence, setViewerSequence] = React.useState<string>("GEPPPGKPADDAGLV")
  const [analyzeSequence, setAnalyzeSequence] = React.useState<string>("")
  const [shouldAnalyze, setShouldAnalyze] = React.useState(false)

  const handleViewStructure = (sequence: string) => {
    setViewerSequence(sequence)
    setActiveTab("viewer")
  }

  const handleAnalyzeSequence = (sequence: string) => {
    setAnalyzeSequence(sequence)
    setShouldAnalyze(true)
    setActiveTab("analyze")
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-5 gap-1">
          <TabsTrigger value="builder" className="text-xs">
            <Dna className="mr-1 size-3" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="analyze" className="text-xs">
            <Sparkles className="mr-1 size-3" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="viewer" className="text-xs">
            <Atom className="mr-1 size-3" />
            Viewer
          </TabsTrigger>
          <TabsTrigger value="library" className="text-xs">
            <Database className="mr-1 size-3" />
            Library
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">
            <FileText className="mr-1 size-3" />
            Notes
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="builder" className="mt-0">
            <PeptideBuilderPanel onViewStructure={handleViewStructure} onAnalyzeSequence={handleAnalyzeSequence} />
          </TabsContent>
          <TabsContent value="analyze" className="mt-0">
            <PeptideAnalyzerPanel
              initialSequence={analyzeSequence}
              shouldAnalyze={shouldAnalyze}
              onAnalyzeComplete={() => setShouldAnalyze(false)}
            />
          </TabsContent>
          <TabsContent value="viewer" className="mt-0">
            <MoleculeViewerPanel initialSequence={viewerSequence} />
          </TabsContent>
          <TabsContent value="library" className="mt-0">
            <PeptideLibraryPanel />
          </TabsContent>
          <TabsContent value="notes" className="mt-0">
            <ResearchNotesPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function PeptideBuilderPanel({
  onViewStructure,
  onAnalyzeSequence,
}: {
  onViewStructure: (sequence: string) => void
  onAnalyzeSequence: (sequence: string) => void
}) {
  const [sequence, setSequence] = React.useState<string[]>([])
  const [peptideName, setPeptideName] = React.useState("")
  const [nTerminus, setNTerminus] = React.useState<"NH2" | "Ace">("NH2")
  const [cTerminus, setCTerminus] = React.useState<"COOH" | "CONH2">("COOH")
  const [pH, setPH] = React.useState(7.0)
  const [showSequenceOverlay, setShowSequenceOverlay] = React.useState(false)

  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<Array<{ name: string; cid: string }>>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>()

  // Debounced search function
  const searchPubChem = React.useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    try {
      const autocompleteResponse = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(query)}/json?limit=50`,
      )

      if (!autocompleteResponse.ok) throw new Error("Search failed")

      const autocompleteData = await autocompleteResponse.json()
      const suggestions = autocompleteData.dictionary_terms?.compound || []

      console.log("[v0] PubChem search results for:", query, suggestions)

      const peptideResults = suggestions.map((name: string) => ({ name, cid: "" }))

      setSearchResults(peptideResults)
      setShowResults(peptideResults.length > 0)
    } catch (error) {
      console.error("PubChem search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle search input change with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchPubChem(value)
    }, 300)
  }

  const knownPeptides: { [key: string]: { sequence: string; fullName: string } } = {
    SEMAGLUTIDE: {
      sequence: "HAEGTFTSDVSSYLEGQAAKEFIAWLVKGRG",
      fullName: "Semaglutide (GLP-1 analog)",
    },
    TIRZEPATIDE: {
      sequence: "HGEGTFTSDLSKQMEEEAVRLFIEWLKNGGPSSGAPPPS",
      fullName: "Tirzepatide (GIP/GLP-1 dual agonist)",
    },
    "BPC-157": {
      sequence: "GEPPPGKPADDAGLV",
      fullName: "BPC-157 (Body Protection Compound)",
    },
    "BPC 157": {
      sequence: "GEPPPGKPADDAGLV",
      fullName: "BPC-157 (Body Protection Compound)",
    },
    THYMOSIN: {
      sequence: "SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES",
      fullName: "Thymosin Beta-4",
    },
    "THYMOSIN BETA-4": {
      sequence: "SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES",
      fullName: "Thymosin Beta-4",
    },
    "TB-4": {
      sequence: "SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES",
      fullName: "Thymosin Beta-4",
    },
    GHK: {
      sequence: "GHK",
      fullName: "GHK-Cu (Copper Peptide)",
    },
    GHKCU: {
      sequence: "GHK",
      fullName: "GHK-Cu (Copper Peptide)",
    },
    "GHK-CU": {
      sequence: "GHK",
      fullName: "GHK-Cu (Copper Peptide)",
    },
    IPAMORELIN: {
      sequence: "AIBHDFKW",
      fullName: "Ipamorelin (Growth Hormone Secretagogue)",
    },
    "CJC-1295": {
      sequence: "YADAIFTNSYRKVLGQLSARKLLQDIMSRQQGESNQERGARARL",
      fullName: "CJC-1295 (GHRH analog)",
    },
    SERMORELIN: {
      sequence: "YADAIFTNSYRKVLGQLSARKLLQDIMSRQQGESNQERGARARL",
      fullName: "Sermorelin (GHRH)",
    },
    TESAMORELIN: {
      sequence: "YADAIFTNSYRKVLGQLSARKLLQDIMSRQQGESNQERGARARL",
      fullName: "Tesamorelin (GHRH analog)",
    },
    MELANOTAN: {
      sequence: "SYSMEHFRWGKPV",
      fullName: "Melanotan II",
    },
    "MELANOTAN II": {
      sequence: "SYSMEHFRWGKPV",
      fullName: "Melanotan II",
    },
    "PT-141": {
      sequence: "SYSMEHFRWGKPV",
      fullName: "PT-141 (Bremelanotide)",
    },
    BREMELANOTIDE: {
      sequence: "SYSMEHFRWGKPV",
      fullName: "Bremelanotide (PT-141)",
    },
    EPITHALON: {
      sequence: "AEDG",
      fullName: "Epithalon (Epitalon)",
    },
    EPITALON: {
      sequence: "AEDG",
      fullName: "Epitalon",
    },
    SELANK: {
      sequence: "TKPRPGP",
      fullName: "Selank (Anxiolytic)",
    },
    SEMAX: {
      sequence: "MEHFPGP",
      fullName: "Semax (Nootropic)",
    },
    DIHEXA: {
      sequence: "NAQTDW",
      fullName: "Dihexa (Cognitive Enhancer)",
    },
    OXYTOCIN: {
      sequence: "CYIQNCPLG",
      fullName: "Oxytocin",
    },
    VASOPRESSIN: {
      sequence: "CYFQNCPRG",
      fullName: "Vasopressin (ADH)",
    },
    INSULIN: {
      sequence: "GIVEQCCTSICSLYQLENYCN",
      fullName: "Insulin (Chain A)",
    },
    GLUCAGON: {
      sequence: "HSQGTFTSDYSKYLDSRRAQDFVQWLMNT",
      fullName: "Glucagon",
    },
    LIRAGLUTIDE: {
      sequence: "HAEGTFTSDVSSYLEGQAAKEFIAWLVRGRG",
      fullName: "Liraglutide (GLP-1 analog)",
    },
    EXENATIDE: {
      sequence: "HGEGTFTSDLSKQMEEEAVRLFIEWLKNGGPSSGAPPPS",
      fullName: "Exenatide (GLP-1 analog)",
    },
    DULAGLUTIDE: {
      sequence: "HGEGTFTSDVSSYLEGQAAKEFIAWLVKGRG",
      fullName: "Dulaglutide (GLP-1 analog)",
    },
  }

  const loadPeptideFromPubChem = async (peptideName: string) => {
    try {
      setIsSearching(true)
      setShowResults(false)

      console.log("[v0] Loading peptide from PubChem:", peptideName)

      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(peptideName)}/JSON`,
      )

      if (!response.ok) {
        console.log("[v0] PubChem API response not OK:", response.status)
        alert(`Could not find "${peptideName}" in PubChem. Please try a different search term.`)
        setSearchQuery("")
        return
      }

      const data = await response.json()
      console.log("[v0] Full PubChem data received:", JSON.stringify(data, null, 2))

      const compound = data.PC_Compounds?.[0]
      if (compound) {
        const props = compound.props || []

        // Helper function to find property by label and optional name
        const findProp = (label: string, name?: string) => {
          return props.find((p: any) => {
            if (name) {
              return p.urn?.label === label && p.urn?.name === name
            }
            return p.urn?.label === label
          })
        }

        // Extract available properties
        const molecularFormula = findProp("Molecular Formula")?.value?.sval
        const molecularWeight = findProp("Molecular Weight")?.value?.sval
        const exactMass = findProp("Mass", "Exact")?.value?.sval
        const smiles = findProp("SMILES", "Canonical")?.value?.sval
        const iupacName = findProp("IUPAC Name", "Preferred")?.value?.sval

        console.log("[v0] Extracted properties:", {
          molecularFormula,
          molecularWeight,
          exactMass,
          smiles,
          iupacName,
        })

        // Check if we have this peptide in our known database
        const knownPeptide = knownPeptides[peptideName.toUpperCase().replace(/[-\s]/g, "")]

        if (knownPeptide) {
          // Use known sequence
          const aminoAcidArray = knownPeptide.sequence.split("")
          setSequence(aminoAcidArray)
          setPeptideName(knownPeptide.fullName)

          alert(
            `Loaded ${knownPeptide.fullName}!\n\n` +
              `Sequence: ${knownPeptide.sequence}\n` +
              `Molecular Formula: ${molecularFormula || "N/A"}\n` +
              `Molecular Weight: ${molecularWeight || "N/A"} Da\n\n` +
              `The sequence has been loaded into the builder.`,
          )
        } else {
          // No known sequence available
          setPeptideName(peptideName)

          alert(
            `Found "${peptideName}" in PubChem!\n\n` +
              `Molecular Formula: ${molecularFormula || "N/A"}\n` +
              `Molecular Weight: ${molecularWeight || "N/A"} Da\n` +
              `Exact Mass: ${exactMass || "N/A"} Da\n\n` +
              `Note: PubChem doesn't provide amino acid sequences directly. ` +
              `Please enter the sequence manually using the amino acid palette below, ` +
              `or search for a known therapeutic peptide like BPC-157, Semaglutide, etc.`,
          )
        }

        setSearchQuery("")
      } else {
        console.log("[v0] No compound data in response")
        alert(`Found "${peptideName}" but no compound data available. Please try a different search.`)
      }
    } catch (error) {
      console.error("[v0] Error loading peptide:", error)
      alert(`Error loading peptide "${peptideName}". Please try again.`)
    } finally {
      setIsSearching(false)
    }
  }

  // Close results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowResults(false)
    if (showResults) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showResults])

  const addAminoAcid = (code: string) => {
    setSequence([...sequence, code])
  }

  const removeLastAminoAcid = () => {
    setSequence(sequence.slice(0, -1))
  }

  const clearSequence = () => {
    setSequence([])
  }

  const calculateMolecularWeight = () => {
    let weight = sequence.length * 110 + 18 // Base calculation

    // Adjust for N-terminus
    if (nTerminus === "Ace") weight += 42 // Acetyl group

    // Adjust for C-terminus
    if (cTerminus === "CONH2") weight += 1 // Amide vs carboxyl

    return weight
  }

  const calculateIsoelectricPoint = () => {
    // Simplified pI calculation based on charged residues
    let positiveCount = 0
    let negativeCount = 0

    sequence.forEach((aa) => {
      if (aa === "K" || aa === "R" || aa === "H") positiveCount++
      if (aa === "D" || aa === "E") negativeCount++
    })

    // Add terminus charges
    if (nTerminus === "NH2") positiveCount++
    if (cTerminus === "COOH") negativeCount++

    // Simplified pI estimation
    if (positiveCount > negativeCount) return 7 + (positiveCount - negativeCount) * 0.5
    if (negativeCount > positiveCount) return 7 - (negativeCount - positiveCount) * 0.5
    return 7.0
  }

  const calculateNetCharge = () => {
    let charge = 0

    sequence.forEach((aa) => {
      if (aa === "K" || aa === "R") charge += 1
      if (aa === "H") charge += 0.5 // Histidine partially charged at pH 7
      if (aa === "D" || aa === "E") charge -= 1
    })

    // Add terminus charges based on pH
    if (nTerminus === "NH2" && pH < 9) charge += 1
    if (cTerminus === "COOH" && pH > 4) charge -= 1

    return charge
  }

  const calculateHydrophobicity = () => {
    // Kyte-Doolittle hydrophobicity scale (simplified)
    const hydrophobicityScale: { [key: string]: number } = {
      A: 1.8,
      C: 2.5,
      D: -3.5,
      E: -3.5,
      F: 2.8,
      G: -0.4,
      H: -3.2,
      I: 4.5,
      K: -3.9,
      L: 3.8,
      M: 1.9,
      N: -3.5,
      P: -1.6,
      Q: -3.5,
      R: -4.5,
      S: -0.8,
      T: -0.7,
      V: 4.2,
      W: -0.9,
      Y: -1.3,
    }

    const sum = sequence.reduce((acc, aa) => acc + (hydrophobicityScale[aa] || 0), 0)
    return (sum * 4.184).toFixed(2) // Convert to kcal/mol
  }

  const calculateExtinctionCoefficient = () => {
    // Based on Trp, Tyr, and Cys content
    let coefficient = 0
    sequence.forEach((aa) => {
      if (aa === "W") coefficient += 5500
      if (aa === "Y") coefficient += 1490
      if (aa === "C") coefficient += 125 // Cystine (disulfide)
    })
    return coefficient
  }

  const handleView3D = () => {
    const sequenceString = sequence.join("")
    onViewStructure(sequenceString)
  }

  const handleAnalyze = () => {
    const sequenceString = sequence.join("")
    onAnalyzeSequence(sequenceString)
  }

  const getTruncatedSequence = (seq: string[]) => {
    const fullSeq = seq.join("")
    if (fullSeq.length <= 18) return fullSeq
    return `${fullSeq.slice(0, 7)}...${fullSeq.slice(-7)}`
  }

  const copySequenceToClipboard = () => {
    const fullSequence = sequence.join("")
    navigator.clipboard.writeText(fullSequence)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search PubChem Database</CardTitle>
          <CardDescription>Find and load peptide sequences from PubChem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for peptides (e.g., BPC-157, Thymosin)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="pl-9 pr-9"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
                <div className="max-h-[400px] overflow-y-auto p-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        loadPeptideFromPubChem(result.name)
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {result.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Type at least 3 characters to search. Click a result to load the peptide sequence.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Peptide Sequence Builder</CardTitle>
          <CardDescription>Build custom peptide sequences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="peptide-name">Peptide Name</Label>
            <Input
              id="peptide-name"
              placeholder="Enter peptide name..."
              value={peptideName}
              onChange={(e) => setPeptideName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Current Sequence</Label>
            <div className="min-h-[60px] rounded-lg border bg-muted/50 p-3">
              {sequence.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {sequence.map((aa, index) => (
                    <span
                      key={index}
                      className="rounded bg-primary px-2 py-1 font-mono text-sm font-semibold text-primary-foreground"
                    >
                      {aa}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No amino acids added yet</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="n-terminus" className="text-xs">
                N-terminus
              </Label>
              <select
                id="n-terminus"
                value={nTerminus}
                onChange={(e) => setNTerminus(e.target.value as "NH2" | "Ace")}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              >
                <option value="NH2">NH₂</option>
                <option value="Ace">Ace</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-terminus" className="text-xs">
                C-terminus
              </Label>
              <select
                id="c-terminus"
                value={cTerminus}
                onChange={(e) => setCTerminus(e.target.value as "COOH" | "CONH2")}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
              >
                <option value="COOH">COOH</option>
                <option value="CONH2">CONH₂</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ph" className="text-xs">
                pH
              </Label>
              <Input
                id="ph"
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={pH}
                onChange={(e) => setPH(Number.parseFloat(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={removeLastAminoAcid} disabled={sequence.length === 0}>
              <Trash2 className="mr-1 size-3" />
              Remove Last
            </Button>
            <Button size="sm" variant="outline" onClick={clearSequence} disabled={sequence.length === 0}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Amino Acid Palette</CardTitle>
          <CardDescription>Click to add to sequence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {aminoAcids.map((aa) => (
              <Button
                key={aa.code}
                variant="outline"
                size="sm"
                onClick={() => addAminoAcid(aa.code)}
                className="h-auto flex-col gap-0.5 py-2"
                title={aa.name}
              >
                <span className="font-mono text-base font-bold">{aa.code}</span>
                <span className="text-[10px] text-muted-foreground">{aa.abbreviation}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {sequence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Peptide Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Sequence:</p>
                <p
                  className="cursor-pointer font-mono font-semibold hover:text-primary"
                  onClick={() => setShowSequenceOverlay(true)}
                  title="Click to view full sequence"
                >
                  {getTruncatedSequence(sequence)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Length:</p>
                <p className="font-semibold">{sequence.length} aa</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mass:</p>
                <p className="font-semibold">{calculateMolecularWeight().toFixed(4)} Da</p>
              </div>
              <div>
                <p className="text-muted-foreground">Isoelectric point (pI):</p>
                <p className="font-semibold">{calculateIsoelectricPoint().toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Net charge (pH {pH}):</p>
                <p className="font-semibold">{calculateNetCharge().toFixed(1)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hydrophobicity:</p>
                <p className="font-semibold">{calculateHydrophobicity()} kcal/mol</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Extinction coefficient:</p>
                <p className="font-semibold">{calculateExtinctionCoefficient()} M⁻¹ cm⁻¹</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {sequence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">2D Structure</CardTitle>
            <CardDescription>Chemical structure representation</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] w-full">
              <PeptideStructure2DEnhanced sequence={sequence.join("")} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start bg-transparent" variant="outline" disabled={sequence.length === 0}>
            <Download className="mr-2 size-4" />
            Save to Library
          </Button>
          <Button
            className="w-full justify-start bg-transparent"
            variant="outline"
            disabled={sequence.length === 0}
            onClick={handleAnalyze}
          >
            <Sparkles className="mr-2 size-4" />
            Analyze Sequence
          </Button>
          <Button
            className="w-full justify-start bg-transparent"
            variant="outline"
            disabled={sequence.length === 0}
            onClick={handleView3D}
          >
            <Atom className="mr-2 size-4" />
            View 3D Structure
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function MoleculeViewerPanel({ initialSequence }: { initialSequence?: string }) {
  const [selectedPeptide, setSelectedPeptide] = React.useState<string>(initialSequence || "GEPPPGKPADDAGLV")
  const [viewMode, setViewMode] = React.useState<"2d" | "3d">("3d")

  React.useEffect(() => {
    if (initialSequence) {
      setSelectedPeptide(initialSequence)
    }
  }, [initialSequence])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Molecule Viewer</CardTitle>
          <CardDescription>Visualize peptide structures in 2D or 3D</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="peptide-select">Peptide Sequence</Label>
            <Input
              id="peptide-select"
              placeholder="Enter peptide sequence (e.g., ACDEFG)..."
              value={selectedPeptide}
              onChange={(e) => setSelectedPeptide(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-muted-foreground">Enter amino acid sequence using single-letter codes</p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "2d" ? "default" : "outline"}
              onClick={() => setViewMode("2d")}
              className="flex-1"
            >
              2D View
            </Button>
            <Button
              size="sm"
              variant={viewMode === "3d" ? "default" : "outline"}
              onClick={() => setViewMode("3d")}
              className="flex-1"
            >
              3D View
            </Button>
          </div>

          <div className="aspect-square rounded-lg border bg-background">
            {viewMode === "2d" ? (
              <div className="flex size-full items-center justify-center p-4">
                <svg viewBox="0 0 200 200" className="size-full">
                  <circle cx="40" cy="100" r="15" fill="hsl(var(--primary))" opacity="0.8" />
                  <line x1="55" y1="100" x2="85" y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
                  <circle cx="100" cy="100" r="15" fill="hsl(var(--primary))" opacity="0.8" />
                  <line x1="115" y1="100" x2="145" y2="100" stroke="hsl(var(--foreground))" strokeWidth="2" />
                  <circle cx="160" cy="100" r="15" fill="hsl(var(--primary))" opacity="0.8" />
                  <text x="40" y="105" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12">
                    N
                  </text>
                  <text x="100" y="105" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12">
                    C
                  </text>
                  <text x="160" y="105" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="12">
                    O
                  </text>
                </svg>
              </div>
            ) : (
              <MoleculeViewer3D peptideSequence={selectedPeptide} />
            )}
          </div>

          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs font-medium">Controls:</p>
            <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
              <li>• Left click + drag to rotate</li>
              <li>• Right click + drag to pan</li>
              <li>• Scroll to zoom in/out</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Molecular Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sequence</span>
            <span className="font-mono font-semibold">{selectedPeptide}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sequence Length</span>
            <span className="font-semibold">{selectedPeptide.length} amino acids</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Molecular Weight</span>
            <span className="font-semibold">~{(selectedPeptide.length * 110 + 18).toFixed(2)} Da</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Backbone Atoms</span>
            <span className="font-semibold">{selectedPeptide.length * 4} atoms</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Load</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setSelectedPeptide("GEPPPGKPADDAGLV")}
          >
            BPC-157
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setSelectedPeptide("GHK")}
          >
            GHK-Cu
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setSelectedPeptide("ACDEFGHIKLMNPQRSTVWY")}
          >
            All 20 Amino Acids
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PeptideLibraryPanel() {
  const [peptides, setPeptides] = React.useState<PeptideSequence[]>([
    {
      id: "1",
      name: "BPC-157",
      sequence: "GEPPPGKPADDAGLV",
      molecularWeight: 1419.55,
      notes: "Body Protection Compound - healing properties",
    },
    {
      id: "2",
      name: "Thymosin Beta-4",
      sequence: "SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES",
      molecularWeight: 4963.4,
      notes: "Tissue repair and regeneration",
    },
    {
      id: "3",
      name: "GHK-Cu",
      sequence: "GHK",
      molecularWeight: 340.38,
      notes: "Copper peptide - skin regeneration",
    },
  ])

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = React.useState<{ type: "success" | "error"; message: string } | null>(null)
  const [selectedSequence, setSelectedSequence] = React.useState<string | null>(null)

  const getTruncatedSequence = (seq: string) => {
    if (seq.length <= 18) return seq
    return `${seq.slice(0, 7)}...${seq.slice(-7)}`
  }

  const copySequenceToClipboard = (sequence: string) => {
    navigator.clipboard.writeText(sequence)
  }

  const parseFastaFile = (content: string): PeptideSequence[] => {
    const peptides: PeptideSequence[] = []
    const entries = content.split(">").filter((entry) => entry.trim())

    entries.forEach((entry) => {
      const lines = entry.trim().split("\n")
      const header = lines[0]
      const sequence = lines.slice(1).join("").replace(/\s/g, "").toUpperCase()

      if (sequence) {
        peptides.push({
          id: Date.now().toString() + Math.random(),
          name: header.split("|")[0].trim() || "Imported Peptide",
          sequence,
          molecularWeight: sequence.length * 110 + 18,
          notes: `Imported from FASTA file`,
        })
      }
    })

    return peptides
  }

  const parsePdbFile = (content: string): PeptideSequence[] => {
    const lines = content.split("\n")
    const sequences: { [key: string]: string } = {}

    lines.forEach((line) => {
      if (line.startsWith("SEQRES")) {
        const parts = line.split(/\s+/)
        const chainId = parts[2]
        const residues = parts.slice(4).join("")

        if (!sequences[chainId]) sequences[chainId] = ""
        sequences[chainId] += residues
      }
    })

    return Object.entries(sequences).map(([chain, seq]) => ({
      id: Date.now().toString() + Math.random(),
      name: `PDB Chain ${chain}`,
      sequence: seq.toUpperCase(),
      molecularWeight: seq.length * 110 + 18,
      notes: "Imported from PDB file",
    }))
  }

  const parseJsonFile = (content: string): PeptideSequence[] => {
    try {
      const data = JSON.parse(content)
      const peptideArray = Array.isArray(data) ? data : [data]

      return peptideArray.map((item) => ({
        id: item.id || Date.now().toString() + Math.random(),
        name: item.name || "Imported Peptide",
        sequence: (item.sequence || "").toUpperCase(),
        molecularWeight: item.molecularWeight || item.sequence?.length * 110 + 18 || 0,
        notes: item.notes || "Imported from JSON file",
      }))
    } catch (error) {
      throw new Error("Invalid JSON format")
    }
  }

  const parseCsvFile = (content: string): PeptideSequence[] => {
    const lines = content.split("\n").filter((line) => line.trim())
    const peptides: PeptideSequence[] = []

    // Skip header if present
    const startIndex = lines[0].toLowerCase().includes("name") || lines[0].toLowerCase().includes("sequence") ? 1 : 0

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""))

      if (parts.length >= 2 && parts[1]) {
        peptides.push({
          id: Date.now().toString() + Math.random(),
          name: parts[0] || `Peptide ${i}`,
          sequence: parts[1].toUpperCase(),
          molecularWeight: Number.parseFloat(parts[2]) || parts[1].length * 110 + 18,
          notes: parts[3] || "Imported from CSV file",
        })
      }
    }

    return peptides
  }

  const parseTxtFile = (content: string): PeptideSequence[] => {
    const lines = content.split("\n").filter((line) => line.trim())
    const peptides: PeptideSequence[] = []

    lines.forEach((line, index) => {
      const sequence = line
        .trim()
        .toUpperCase()
        .replace(/[^ACDEFGHIKLMNPQRSTVWY]/g, "")

      if (sequence.length > 0) {
        peptides.push({
          id: Date.now().toString() + Math.random(),
          name: `Peptide ${index + 1}`,
          sequence,
          molecularWeight: sequence.length * 110 + 18,
          notes: "Imported from text file",
        })
      }
    })

    return peptides
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportStatus(null)

    try {
      const content = await file.text()
      const extension = file.name.split(".").pop()?.toLowerCase()
      let importedPeptides: PeptideSequence[] = []

      switch (extension) {
        case "fasta":
        case "fa":
          importedPeptides = parseFastaFile(content)
          break
        case "pdb":
          importedPeptides = parsePdbFile(content)
          break
        case "json":
          importedPeptides = parseJsonFile(content)
          break
        case "csv":
          importedPeptides = parseCsvFile(content)
          break
        case "txt":
          importedPeptides = parseTxtFile(content)
          break
        default:
          throw new Error(`Unsupported file format: .${extension}`)
      }

      if (importedPeptides.length === 0) {
        throw new Error("No valid peptide sequences found in file")
      }

      setPeptides([...peptides, ...importedPeptides])
      setImportStatus({
        type: "success",
        message: `Successfully imported ${importedPeptides.length} peptide${importedPeptides.length > 1 ? "s" : ""}`,
      })
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to import file",
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {selectedSequence && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedSequence(null)}
        >
          <div className="relative rounded-lg bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSequence(null)}
              className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
            >
              <span className="text-xl">×</span>
            </button>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Full Sequence:</p>
              <p className="max-w-2xl break-all font-mono text-sm font-semibold">{selectedSequence}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  copySequenceToClipboard(selectedSequence)
                }}
              >
                Copy Text
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Peptide Library</CardTitle>
          <CardDescription>Saved peptide sequences and research</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="mb-4 w-full">
            <Plus className="mr-2 size-4" />
            Add New Peptide
          </Button>

          {importStatus && (
            <div
              className={`mb-4 rounded-lg border p-3 text-sm ${
                importStatus.type === "success"
                  ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                  : "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {importStatus.message}
            </div>
          )}

          <div className="space-y-3">
            {peptides.map((peptide) => (
              <div key={peptide.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{peptide.name}</p>
                    <p
                      className="mt-1 cursor-pointer font-mono text-xs text-muted-foreground hover:text-primary"
                      onClick={() => setSelectedSequence(peptide.sequence)}
                      title="Click to view full sequence"
                    >
                      {getTruncatedSequence(peptide.sequence)}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{peptide.sequence.length} aa</span>
                      <span>•</span>
                      <span>{peptide.molecularWeight.toFixed(2)} Da</span>
                    </div>
                    {peptide.notes && <p className="mt-2 text-xs text-muted-foreground">{peptide.notes}</p>}
                  </div>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Library Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".fasta,.fa,.pdb,.json,.csv,.txt"
            onChange={handleFileImport}
            className="hidden"
          />
          <Button
            className="w-full justify-start bg-transparent"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 size-4" />
            Import from File
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline">
            <Download className="mr-2 size-4" />
            Export Library
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supported File Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 font-mono">
                FASTA
              </Badge>
              <span>Standard sequence format (.fasta, .fa)</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 font-mono">
                PDB
              </Badge>
              <span>Protein Data Bank format (.pdb)</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 font-mono">
                JSON
              </Badge>
              <span>Structured data format (.json)</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 font-mono">
                CSV
              </Badge>
              <span>Comma-separated values (.csv)</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5 font-mono">
                TXT
              </Badge>
              <span>Plain text sequences (.txt)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ResearchNotesPanel() {
  const [notes, setNotes] = React.useState<ResearchNote[]>([
    {
      id: "1",
      title: "BPC-157 Dosage Study",
      content: "Optimal dosage appears to be 250-500mcg daily. Shows promising results in tissue repair.",
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Thymosin Beta-4 Mechanism",
      content: "Acts through actin sequestration. Promotes cell migration and angiogenesis.",
      timestamp: new Date(Date.now() - 86400000),
    },
  ])

  const [newNoteTitle, setNewNoteTitle] = React.useState("")
  const [newNoteContent, setNewNoteContent] = React.useState("")

  const addNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return

    const newNote: ResearchNote = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      timestamp: new Date(),
    }

    setNotes([newNote, ...notes])
    setNewNoteTitle("")
    setNewNoteContent("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Research Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              placeholder="Note title..."
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              placeholder="Research notes, observations, findings..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={4}
            />
          </div>
          <Button className="w-full" onClick={addNote}>
            <Plus className="mr-2 size-4" />
            Add Note
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Research Notes</CardTitle>
          <CardDescription>{notes.length} notes saved</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{note.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{note.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PeptideAnalyzerPanel({
  initialSequence,
  shouldAnalyze,
  onAnalyzeComplete,
}: {
  initialSequence?: string
  shouldAnalyze?: boolean
  onAnalyzeComplete?: () => void
}) {
  const [sequence, setSequence] = React.useState("")
  const [analysis, setAnalysis] = React.useState("")
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  React.useEffect(() => {
    if (initialSequence) {
      setSequence(initialSequence)
    }
  }, [initialSequence])

  React.useEffect(() => {
    if (shouldAnalyze && sequence && !isAnalyzing) {
      analyzePeptide()
      onAnalyzeComplete?.()
    }
  }, [shouldAnalyze, sequence])

  const analyzePeptide = async () => {
    if (!sequence.trim()) return

    setIsAnalyzing(true)
    setAnalysis("")

    try {
      const response = await fetch("/api/analyze-peptide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence: sequence.toUpperCase() }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No reader available")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("0:")) {
            const text = line.slice(2).replace(/^"(.*)"$/, "$1")
            setAnalysis((prev) => prev + text)
          }
        }
      }
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysis("Error analyzing peptide. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const loadExample = (exampleSequence: string) => {
    setSequence(exampleSequence)
    setAnalysis("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Peptide Validation & Analysis</CardTitle>
          <CardDescription>AI-powered analysis of therapeutic potential and research data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="analyze-sequence">Peptide Sequence</Label>
            <Input
              id="analyze-sequence"
              placeholder="Enter peptide sequence (e.g., GEPPPGKPADDAGLV)..."
              value={sequence}
              onChange={(e) => setSequence(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-muted-foreground">
              Enter amino acid sequence using single-letter codes (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V,
              W, Y)
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={analyzePeptide} disabled={!sequence.trim() || isAnalyzing} className="flex-1">
              <Sparkles className="mr-2 size-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze Peptide"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => loadExample("GEPPPGKPADDAGLV")}>
              BPC-157
            </Button>
            <Button size="sm" variant="outline" onClick={() => loadExample("GHK")}>
              GHK-Cu
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => loadExample("SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES")}
            >
              TB-4
            </Button>
          </div>
        </CardContent>
      </Card>

      {(analysis || isAnalyzing) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Analysis Results</CardTitle>
            <CardDescription>AI-generated insights based on research data</CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing && !analysis ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Analyzing peptide sequence...
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{analysis}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="size-4" />
            Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This analysis is for research and educational purposes only. It is based on available scientific literature
            and AI interpretation. Always consult with qualified medical professionals and conduct proper clinical
            research before any therapeutic applications. This tool does not provide medical advice.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analysis Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                1
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">Therapeutic Potential</p>
                <p className="text-xs text-muted-foreground">
                  Identifies potential benefits based on sequence characteristics and known research
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                2
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">Structural Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Evaluates stability, folding patterns, and molecular properties
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                3
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">Research Comparison</p>
                <p className="text-xs text-muted-foreground">
                  Compares to known therapeutic peptides and existing research
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">
                4
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">Safety Profile</p>
                <p className="text-xs text-muted-foreground">
                  Highlights potential safety considerations and contraindications
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
