import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecordService } from '../services/record.service';

@Component({
  selector: 'app-product-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-screen-xl mx-auto px-4 md:px-8 pt-8 pb-32">
      @if (item()) {
        <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          <div class="lg:col-span-7 space-y-6">
            <div class="aspect-square bg-surface-container-low overflow-hidden group">
              <img [src]="item()?.image_url" [alt]="item()?.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerpolicy="no-referrer" />
            </div>
          </div>
          
          <div class="lg:col-span-5 flex flex-col">
            <div class="mb-8">
              @if (item()?.year) {
                <span class="inline-block px-2 py-0.5 bg-primary-container/10 text-primary-fixed-dim text-[10px] font-bold tracking-widest uppercase mb-4">Original {{item()?.year}} Pressing</span>
              }
              <h1 class="font-headline text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-2">{{item()?.title}}</h1>
              <p class="font-headline text-lg md:text-xl text-on-surface/60 font-medium">{{item()?.artist}}</p>
              <div class="mt-6 flex items-baseline gap-2">
                <span class="text-2xl md:text-3xl font-headline font-black text-primary-container">¥{{item()?.price}}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="bg-surface-container-low p-4 border-l-2 border-primary-container">
                <p class="text-[10px] text-on-surface/40 uppercase tracking-widest mb-1">Media Grade</p>
                <p class="text-xl font-headline font-bold text-on-surface">{{item()?.media_grade}}</p>
              </div>
              <div class="bg-surface-container-low p-4 border-l-2 border-on-surface/20">
                <p class="text-[10px] text-on-surface/40 uppercase tracking-widest mb-1">Sleeve Grade</p>
                <p class="text-xl font-headline font-bold text-on-surface">{{item()?.sleeve_grade}}</p>
              </div>
            </div>

            <div class="space-y-4 mb-8">
              <div class="flex justify-between py-3 border-b border-white/5">
                <span class="text-sm text-on-surface/40">介质</span>
                <span class="text-sm font-medium">{{item()?.format}}</span>
              </div>
              @if (item()?.label) {
                <div class="flex justify-between py-3 border-b border-white/5">
                  <span class="text-sm text-on-surface/40">厂牌</span>
                  <span class="text-sm font-medium">{{item()?.label}}</span>
                </div>
              }
              @if (item()?.year) {
                <div class="flex justify-between py-3 border-b border-white/5">
                  <span class="text-sm text-on-surface/40">压片年份</span>
                  <span class="text-sm font-medium">{{item()?.year}}</span>
                </div>
              }
              @if (item()?.catalog_number) {
                <div class="flex justify-between py-3 border-b border-white/5">
                  <span class="text-sm text-on-surface/40">目录号</span>
                  <span class="text-sm font-medium">{{item()?.catalog_number}}</span>
                </div>
              }
            </div>
          </div>
        </section>

        @if (item()?.description || item()?.audio_features || item()?.accessories) {
          <section class="mt-24 max-w-3xl pb-24">
            <h2 class="font-headline text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">关于唱片</h2>
            
            @if (item()?.description) {
              <div class="space-y-6 text-on-surface/80 leading-relaxed font-body text-base md:text-lg whitespace-pre-line">
                {{item()?.description}}
              </div>
            }

            @if (item()?.audio_features || item()?.accessories) {
              <div class="mt-12 p-8 bg-surface-container-lowest border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
                @if (item()?.audio_features) {
                  <div>
                    <h4 class="text-xs font-bold text-primary-container tracking-widest uppercase mb-4">音频特征</h4>
                    <ul class="space-y-2 text-sm text-on-surface/60 whitespace-pre-line">
                      {{item()?.audio_features}}
                    </ul>
                  </div>
                }
                @if (item()?.accessories) {
                  <div>
                    <h4 class="text-xs font-bold text-primary-container tracking-widest uppercase mb-4">配件清单</h4>
                    <ul class="space-y-2 text-sm text-on-surface/60 whitespace-pre-line">
                      {{item()?.accessories}}
                    </ul>
                  </div>
                }
              </div>
            }
          </section>
        }
      } @else {
        <div class="py-24 text-center text-on-surface/60">加载中...</div>
      }
    </div>

    <!-- action bar ... -->
    <div class="fixed bottom-[80px] md:bottom-0 left-0 w-full z-40 bg-surface-container-low/95 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex items-center justify-between gap-4 md:px-24">
      <button class="flex-grow py-4 bg-surface-container-high text-on-surface font-bold rounded-full flex items-center justify-center gap-2 hover:bg-surface-bright transition-all active:scale-95">
        <span class="material-symbols-outlined text-xl">chat_bubble</span>
        联系卖家
      </button>
      <button class="flex-[2] py-4 bg-primary-container text-on-primary-container font-extrabold rounded-full flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,85,64,0.3)] hover:brightness-110 transition-all active:scale-95">
        <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">shopping_cart</span>
        加入购物车
      </button>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recordService = inject(RecordService);
  item = signal<any>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recordService.getRecord(id).subscribe({
          next: (data) => this.item.set(data),
          error: (err) => console.error('Error fetching record:', err)
        });
      }
    });
  }
}
