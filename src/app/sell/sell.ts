import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { RecordService } from '../services/record.service';

@Component({
  selector: 'app-sell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="px-6 max-w-3xl mx-auto pt-8 pb-24">
      <div class="mb-12 flex items-center gap-4">
        <a routerLink="/profile" class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </a>
        <div>
          <h1 class="font-headline text-3xl md:text-4xl font-black tracking-tight text-on-surface uppercase">出售唱片</h1>
          <p class="text-on-surface/50 font-body text-sm mt-1">填写唱片详细信息以上架</p>
        </div>
      </div>

      <form [formGroup]="sellForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- 基本信息 -->
        <section class="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-on-surface/5">
          <h2 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">album</span>
            基本信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">标题 (Title) *</label>
              <input type="text" formControlName="title" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="例如: Dark Side of the Moon">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">艺术家 (Artist) *</label>
              <input type="text" formControlName="artist" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="例如: Pink Floyd">
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">封面图片 (Cover Image) *</label>
              <div 
                class="relative w-full h-48 md:h-64 bg-surface-container border-2 border-dashed rounded-xl flex flex-col items-center justify-center overflow-hidden transition-colors cursor-pointer group"
                [class.border-primary]="isDragging()"
                [class.border-outline-variant]="!isDragging()"
                [class.bg-surface-container-high]="isDragging()"
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                (drop)="onDrop($event)"
                (click)="fileInput.click()"
              >
                <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)">
                
                @if (imagePreview()) {
                  <img [src]="imagePreview()" class="absolute inset-0 w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="text-white font-bold flex items-center gap-2">
                      <span class="material-symbols-outlined">edit</span> 更换图片
                    </span>
                  </div>
                } @else {
                  <span class="material-symbols-outlined text-4xl text-on-surface/40 mb-2 group-hover:text-primary transition-colors">add_photo_alternate</span>
                  <p class="text-sm text-on-surface/60 font-medium group-hover:text-primary transition-colors">点击或拖拽上传图片</p>
                  <p class="text-xs text-on-surface/40 mt-1">支持 JPG, PNG 格式</p>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- 销售与品相 -->
        <section class="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-on-surface/5">
          <h2 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">sell</span>
            销售与品相
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2 md:col-span-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">价格 (Price ¥) *</label>
              <input type="number" formControlName="price" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-headline text-lg" placeholder="0.00">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">介质品相 (Media Grade) *</label>
              <div class="relative">
                <select formControlName="mediaGrade" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors appearance-none pr-10">
                  @for (grade of grades; track grade) {
                    <option [value]="grade">{{grade}}</option>
                  }
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface/40">expand_more</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">封套品相 (Sleeve Grade) *</label>
              <div class="relative">
                <select formControlName="sleeveGrade" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors appearance-none pr-10">
                  @for (grade of sleeveGrades; track grade) {
                    <option [value]="grade">{{grade}}</option>
                  }
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface/40">expand_more</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 出版信息 -->
        <section class="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-on-surface/5">
          <h2 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">info</span>
            出版信息
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">介质格式 (Format) *</label>
              <input type="text" formControlName="format" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="例如: 12&quot; Vinyl, LP">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">厂牌 (Label)</label>
              <input type="text" formControlName="label" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="例如: Harvest Records">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">压片年份 (Year)</label>
              <input type="number" formControlName="year" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="例如: 1974">
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">目录号 (Catalog Number)</label>
              <input type="text" formControlName="catalogNumber" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors" placeholder="例如: SHVL 804">
            </div>
          </div>
        </section>

        <!-- 详细描述 -->
        <section class="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-on-surface/5">
          <h2 class="font-headline text-xl font-bold mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">description</span>
            详细描述
          </h2>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">唱片描述 (Description)</label>
              <textarea formControlName="description" rows="4" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors resize-none" placeholder="描述唱片的背景、听感、收藏价值等..."></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">音频特征 (Audio Features)</label>
              <textarea formControlName="audioFeatures" rows="3" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors resize-none" placeholder="例如: 全模拟母带压制, 180g 重盘材质..."></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold tracking-widest uppercase text-on-surface/60">配件清单 (Accessories)</label>
              <textarea formControlName="accessories" rows="3" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none transition-colors resize-none" placeholder="例如: 原始歌词内页, 附赠海报..."></textarea>
            </div>
          </div>
        </section>

        <div class="pt-6 flex gap-4">
          <button type="button" 
            (click)="onCancel()"
            class="flex-1 py-4 bg-surface-container text-on-surface font-headline font-extrabold text-lg rounded-full hover:bg-surface-container-high transition-all active:scale-95">
            取消
          </button>
          <button type="submit" 
            class="flex-[2] py-4 bg-primary text-on-primary font-headline font-extrabold text-lg rounded-full shadow-[0_10px_30px_rgba(255,85,64,0.3)] hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100"
            [disabled]="!sellForm.valid || isSubmitting()">
            {{ isSubmitting() ? '正在提交...' : '确认上架' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class SellComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private recordService = inject(RecordService);

  isSubmitting = signal(false);

  sellForm = this.fb.group({
    title: ['', Validators.required],
    artist: ['', Validators.required],
    image: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    mediaGrade: ['NM', Validators.required],
    sleeveGrade: ['VG+', Validators.required],
    format: ['', Validators.required],
    label: [''],
    year: [''],
    catalogNumber: [''],
    description: [''],
    audioFeatures: [''],
    accessories: ['']
  });

  grades = ['M', 'NM', 'VG+', 'VG', 'G', 'F', 'P'];
  sleeveGrades = ['M', 'NM', 'VG+', 'VG', 'G', 'F', 'P', 'Generic', 'None'];

  imagePreview = signal<string | null>(null);
  isDragging = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.imagePreview.set(result);
      this.sellForm.patchValue({ image: result });
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.sellForm.valid) {
      this.isSubmitting.set(true);
      this.recordService.createRecord(this.sellForm.value).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          alert('唱片上架成功！');
          this.sellForm.reset({
            mediaGrade: 'NM',
            sleeveGrade: 'VG+'
          });
          this.imagePreview.set(null);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error('Submit Error:', err);
          alert('上架失败，请重试。' + err.message);
        }
      });
    } else {
      this.sellForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.sellForm.reset({
      mediaGrade: 'NM',
      sleeveGrade: 'VG+'
    });
    this.imagePreview.set(null);
    this.router.navigate(['/profile']);
  }
}
