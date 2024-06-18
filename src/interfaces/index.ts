export interface LottieFile {
  filename: string;
  contents: string;
}

export interface LottieItem {
  id: string;
  description: string;
  author: string;
  tags: string[];
  dateUploaded: string;
  lottieFile: LottieFile;
}

export interface LottieJSONFile {
  v: string;
  fr: number;
  ip: number;
  op: number;
  layers: object[];
}
