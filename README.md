# Frontend

GCP cloud run

1. 建立 Secret（一次性操作）
GCP 啟用 Secret Manager API 之後
```bash
gcloud secrets create GOOGLE_MAPS_API_KEY --data-file=- <<EOF
YOUR_GOOGLE_MAPS_API_KEY_HERE
EOF
```



