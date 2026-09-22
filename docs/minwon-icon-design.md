# 민원팩토리 아이콘 제작 기록

- 제작일: 2026-09-22
- 도구: 내장 image_gen (CLI/API fallback 사용 안 함)
- 참조 이미지: `D:\Minwon_Factory_Migration\frontend\public\favicon.png` (읽기 전용)
- 최종 자산: `assets/brand/minwon-factory-icon-v2.png`
- 적용 위치: 민원팩토리 소개 제목 옆 아이콘, 브랜드 소개 그래픽 내부 제품 이름 옆 아이콘
- 방향: 사람·문서·연필의 기존 의미를 유지하며 네이비·청록색으로 단순화. 밝은 불투명 배경에 CSS 둥근 모서리를 적용해 라이트·다크에서 공통 사용.
- 보존: 기존 민원팩토리 저장소 아이콘, 홈페이지 구 버전 아이콘, 라이트워크 회사 로고 및 홈페이지 favicon.

## 최초 제작 프롬프트

```text
Use case: logo-brand.
Asset type: final standalone square PNG app icon for the Korean civic-response drafting service Minwon Factory, used at 28px and 56px on a LIGHTWORK website.
Input image: the provided old favicon is a conceptual reference, not an invariant editing target. It depicts three people merging into a document/factory base with a diagonal pencil. Redesign this into one cleaner, distinctive, professional icon while retaining recognizable people + document-writing + factory ideas.
Design: precise flat vector-like geometry, bold simple silhouettes and rounded corners, restrained polished public-service SaaS identity. Three simplified human heads and upright bodies merge naturally into a compact navy document/factory base with only two clear negative-space horizontal document strokes. A single simplified teal diagonal pencil at upper right completes the mark. Strong legibility when reduced to 28px. No tiny lines.
Palette: deep navy #0B2B54 and teal #14B8A6 on a solid warm off-white #FAFBF8 rounded-square tile. Omit the old royal blue and yellow. No border on the tile. Transparent alpha outside the rounded-square tile. Icon tile occupies the entire square canvas with corners around 20% radius; internal pictogram takes about 76% of tile width, optically centered with even safe padding.
Output: one icon only, square 1024x1024 raster PNG, front-facing, sharp clean edges, no text, no letters, no wordmark, no gradients, no 3D, no shadows, no mockup scene, no multiple alternatives, no watermark. Do not include or redesign the LIGHTWORK corporate logo.
```

## 최종 보정 프롬프트

```text
Use case: precise-object-edit. Edit the provided newly designed Minwon Factory icon. Preserve the exact navy three-people/document silhouette and teal diagonal pencil composition. Change ONLY the background treatment: REMOVE every gray checkerboard pixel and REMOVE the rounded square tile outline/boundary. Make the ENTIRE square canvas a solid fully opaque off-white #FAFBF8 from edge to edge, including all four corners. Absolutely no transparency and no checkerboard anywhere, no outer border or shadow. Keep the icon pictogram centered and preserve its current dimensions and safe space. Flatten subtle texture into clean solid navy #0B2B54 and teal #14B8A6 fields. One final square PNG icon, no words, no mockup. It will receive rounded corners through website CSS.
```

