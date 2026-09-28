/*
 * EDIT THIS FILE ONLY.
 * 修改引号里的文字即可；数组中增删整项即可调整履历。
 * publications[].links 里留空或删掉的项不会显示。
 * news 文本里用 **文字** 可以加粗。
 */
window.PROFILE = {
  name: "Liang You",
  shortName: "liang.you",
  field: "biostatistics",
  pageTitle: "Page of Liang",
  description:
    "Liang You is a PhD student in Biostatistics at the University of Pittsburgh working on statistical machine learning for biomedical data.",
  position: "PhD Student in Biostatistics",
  affiliation: "University of Pittsburgh",
  location: "Pittsburgh, PA",
  timezone: "America/New_York",
  status: "Open to collaborations",
  bio:
    "I develop statistical machine learning methods for biomedical data. My dissertation research focuses on neurodegeneration. I also work on uncertainty quantification that holds up under missingness and distribution shift, and on early detection from physiological time series.",
  photo: "assets/before_the_sphinx.jpg",
  photoLabel: "before_the_sphinx.jpg",
  email: "liangyou03@pitt.edu",
  github: "https://github.com/liangyou03",

  news: [
    {
      date: "2026.10.27",
      text: "Workshop on fine-tuning foundation models for cell segmentation, hosted by Pitt CRCD and **NVIDIA**.",
      upcoming: true,
    },
    {
      date: "2026.09",
      text: "SimplexUQ accepted to NeurIPS 2026.",
    },
    {
      date: "2026.07",
      text: "Travel award for the ICML 2026 Workshop on Structured Data for Health.",
    },
    {
      date: "2025.08",
      text: "Started the PhD in Biostatistics at the University of Pittsburgh.",
    },
  ],

  publications: [
    {
      authors: [
        { name: "L. You", self: true, corresponding: true },
        { name: "H. Shi" },
        { name: "D. Ou" },
      ],
      title: "SimplexUQ: An Evaluation Framework and Benchmark for Conformal Uncertainty on Simplex-Valued Predictions",
      venue: "NeurIPS 2026",
      links: {},
      bibtex: `@inproceedings{you2026simplexuq,
  title     = {SimplexUQ: An Evaluation Framework and Benchmark for Conformal Uncertainty on Simplex-Valued Predictions},
  author    = {You, Liang and Shi, Hengyu and Ou, Dongwen},
  booktitle = {Advances in Neural Information Processing Systems},
  year      = {2026}
}`,
    },
    {
      authors: [
        { name: "L. You", self: true, corresponding: true },
        { name: "D. Ou" },
        { name: "H. Shi" },
        { name: "S. Dai" },
      ],
      title: "Missingness-Aware Conformal Prediction Under Cross-Hospital Distribution Shift",
      venue: "ICML 2026 Workshop on Structured Data for Health (SD4H)",
      links: {
        arXiv: "https://arxiv.org/abs/2609.30781",
        PDF: "https://arxiv.org/pdf/2609.30781",
      },
      bibtex: `@misc{you2026missingness,
  title         = {Missingness-Aware Conformal Prediction Under Cross-Hospital Distribution Shift},
  author        = {You, Liang and Ou, Dongwen and Shi, Hengyu and Dai, Siyuan},
  year          = {2026},
  eprint        = {2609.30781},
  archivePrefix = {arXiv},
  primaryClass  = {cs.LG},
  url           = {https://arxiv.org/abs/2609.30781}
}`,
    },
    {
      authors: [
        { name: "H. Su", equal: true },
        { name: "L. You", self: true, equal: true },
        { name: "B. Jiang", equal: true },
        { name: "Z. Wu" },
        { name: "G. Kong", corresponding: true },
        { name: "Y. Feng", corresponding: true },
      ],
      title: "Machine Learning-based Early Detection of Intraoperative Anaphylaxis Among Patients with Hypotension Using Real-World Physiological Time Series Data",
      venue: "Journal of Medical Systems, 50(1), 128, 2026",
      links: {
        DOI: "https://doi.org/10.1007/s10916-026-02452-8",
      },
      bibtex: `@article{su2026anaphylaxis,
  title   = {Machine Learning-based Early Detection of Intraoperative Anaphylaxis Among Patients with Hypotension Using Real-World Physiological Time Series Data},
  author  = {Su, H. and You, Liang and Jiang, B. and Wu, Z. and Kong, G. and Feng, Y.},
  journal = {Journal of Medical Systems},
  volume  = {50},
  number  = {1},
  pages   = {128},
  year    = {2026},
  doi     = {10.1007/s10916-026-02452-8}
}`,
    },
  ],

  workshops: [
    {
      title: "Foundation models for cell segmentation: fine-tuning and population-scale analysis",
      role: "Co-instructor with Jiebiao Wang",
      host: "Pitt Center for Research Computing and Data × NVIDIA",
      date: "2026.10.27",
      upcoming: true,
    },
  ],

  honors: [
    {
      title: "Best Ph.D. Qualifying Exam Performance Award",
      institution: "University of Pittsburgh",
      year: "2026",
    },
    {
      title: "Travel Award",
      institution: "ICML Workshop on Structured Data for Health (SD4H)",
      year: "2026",
    },
  ],

  education: [
    {
      institution: "University of Pittsburgh",
      degree: "Ph.D. in Biostatistics",
      date: "2025 → now",
      detail: "",
    },
    {
      institution: "University of California, Santa Barbara",
      degree: "Visiting Student",
      date: "Fall 2023",
      detail: "",
    },
    {
      institution: "Xiamen University",
      degree: "B.S. in Statistics",
      date: "2021 → 2025",
      detail: "",
    },
  ],
};
