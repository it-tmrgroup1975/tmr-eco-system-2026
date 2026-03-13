import os
import sys
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv # เพิ่มการ import

# 1. Load ค่าจากไฟล์ .env
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# เพิ่มบรรทัดนี้: ทำให้ Django มองเห็น Apps ในโฟลเดอร์ backend/apps
sys.path.insert(0, os.path.join(BASE_DIR, 'backend', 'apps'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/

# 2. ดึงค่า SECRET_KEY จาก .env
# หากไม่มีค่าใน .env ให้ใส่ค่า Default ไว้ป้องกัน Error (เฉพาะช่วง Dev)
SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-key-for-dev-only')

# 3. ดึงค่า DEBUG และจัดการเรื่อง Type (เพราะ env มักจะเป็น string)
DEBUG = os.getenv('DEBUG', 'True') == 'True'

hosts_raw = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost')
ALLOWED_HOSTS = [host.strip() for host in hosts_raw.split(',') if host.strip()]

# ในช่วง Development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # จำกัดที่ 5MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880

# อนุญาตให้ส่ง Credentials (เช่น Cookies หรือ Authorization Header)
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated', # บังคับ Login ทุก API เป็นค่าเริ่มต้น
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# ตั้งค่าอายุของ Token และการหมุน Token (Rotation)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

AUTH_USER_MODEL = 'users.User'

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'users',  # ใส่แค่ 'users' ได้เลยเพราะเราทำ sys.path.insert ไว้แล้ว

    # 3rd Party Packages
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # ต้องอยู่บนสุดหรือก่อน CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# 4. ตั้งค่า DATABASES โดยดึงจาก .env
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql', # หรือ 'django.db.backends.sqlite3'
#         'NAME': os.getenv('DB_NAME'),
#         'USER': os.getenv('DB_USER'),
#         'PASSWORD': os.getenv('DB_PASSWORD'),
#         'HOST': os.getenv('DB_HOST'),
#         'PORT': os.getenv('DB_PORT'),
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': BASE_DIR / os.getenv('DB_NAME_SQLITE', 'db.sqlite3'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = 'static/'
