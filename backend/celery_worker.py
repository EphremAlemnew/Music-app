#!/usr/bin/env python
import os
from music_app.celery import app
from celery.bin import worker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'music_app.settings')

if __name__ == '__main__':
    worker = worker.worker(app=app)
    worker.run(loglevel='INFO')
