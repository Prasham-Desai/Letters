export type WaxSealType = 'flower' | 'moon' | 'leaf' | 'star' | 'feather' | 'bear' | 'bird';
export type StampType = 'mountains' | 'rain' | 'rabbit' | 'cat' | 'moon' | 'lighthouse' | 'wildflowers' | 'teacup' | 'forest' | 'cottage';
export type PaperTone = 'cream' | 'ivory' | 'warm' | 'aged' | 'soft';
export type SealColor = 'burgundy' | 'forest' | 'navy' | 'terracotta' | 'brown' | 'purple';
export type LetterCategory = 'comfort' | 'celebration' | 'memories' | 'future' | 'sleep' | 'lonely' | 'motivation' | 'forgiveness' | 'birthday' | 'funny' | 'love' | 'hope' | 'angry';

export interface LetterMeta {
  id: string;
  title: string;
  file: string;
  stamp: StampType;
  seal: SealColor;
  sealType: WaxSealType;
  rotation: number;
  paper: PaperTone;
  category: LetterCategory;
  opened?: boolean;
}

export interface Letter extends LetterMeta {
  content: string;
}

export interface PlacedEnvelope extends LetterMeta {
  x: number;
  y: number;
  width: number;
  height: number;
  deskW?: number;
  deskH?: number;
}
