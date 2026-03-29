import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RecordService } from '../services/record.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="grainy-bg"></div>
    <section class="relative px-6 pt-12 pb-20 md:pt-24 md:pb-32 flex flex-col items-start max-w-7xl mx-auto">
      <div class="z-10 w-full">
        <p class="font-label text-primary tracking-[0.3em] text-xs uppercase mb-4 opacity-80">Premium Crate Digging</p>
        <h2 class="font-headline text-4xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-[0.9] max-w-4xl">
          开始淘碟：<br/>
          <span class="text-primary-container [.light_&]:text-primary">稀有黑胶</span>与磁带
        </h2>
        <p class="font-body text-on-surface/60 mt-8 max-w-xl text-base md:text-lg leading-relaxed">
          在这里，音乐不只是流媒体。探索来自全球私人收藏家的珍稀首版，让每一次转动都充满仪式感。
        </p>
      </div>
      <div class="absolute right-[-10%] top-20 w-[600px] h-[600px] opacity-20 hidden lg:block pointer-events-none">
        <div class="w-full h-full rounded-full border-[40px] border-on-surface/5 flex items-center justify-center animate-[spin_10s_linear_infinite]">
          <div class="w-2/3 h-2/3 rounded-full border-[20px] border-on-surface/10 flex items-center justify-center">
            <div class="w-1/2 h-1/2 rounded-full bg-primary-container/20 [.light_&]:bg-primary/20"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 py-12 max-w-7xl mx-auto relative z-10">
      <div class="flex justify-between items-end mb-12">
        <div>
          <h3 class="font-headline text-2xl md:text-3xl font-bold tracking-tight">最新到货</h3>
          <div class="h-1 w-12 bg-primary-container [.light_&]:bg-primary mt-2"></div>
        </div>
        <div class="flex gap-4">
          <button class="p-2 hover:text-primary transition-colors"><span class="material-symbols-outlined">filter_list</span></button>
          <button class="p-2 hover:text-primary transition-colors"><span class="material-symbols-outlined">grid_view</span></button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
        @for (item of items(); track item.id) {
          <a [routerLink]="['/product', item.id]" class="group flex flex-col cursor-pointer">
            <div class="relative aspect-square overflow-hidden bg-surface-container-low mb-6 rounded-none">
              <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-110" referrerpolicy="no-referrer" />
              <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] px-2 py-1 font-bold tracking-widest">[{{item.format}}]</div>
              <div class="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md px-2 py-1 text-[10px] text-primary border border-primary/20">{{item.condition}}</div>
            </div>
            <div class="space-y-1">
              <h4 class="font-headline text-base md:text-lg font-bold group-hover:text-primary transition-colors">{{item.title}}</h4>
              <p class="font-body text-sm text-on-surface/50">{{item.artist}}</p>
              <div class="flex justify-between items-center pt-4">
                <span class="font-headline font-extrabold text-lg md:text-xl">¥{{item.price}}</span>
                <button (click)="toggleLike($event, item)" 
                        class="material-symbols-outlined transition-all duration-300 hover:scale-110 active:scale-95"
                        [class.animate-heart-pop]="item.liked"
                        [class.text-primary]="item.liked"
                        [class.text-on-surface]="!item.liked"
                        [class.opacity-30]="!item.liked"
                        [class.group-hover:text-primary]="!item.liked"
                        [style.font-variation-settings]="item.liked ? '&quot;FILL&quot; 1' : '&quot;FILL&quot; 0'">
                  favorite
                </button>
              </div>
            </div>
          </a>
        }
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private recordService = inject(RecordService);
  items = signal<any[]>([]);

  ngOnInit() {
    this.recordService.getRecords().subscribe({
      next: (data) => {
        this.items.set(data.map(item => ({
          ...item,
          condition: `${item.media_grade} / ${item.sleeve_grade}`,
          image: item.image_url
        })));
      },
      error: (err) => {
        console.error('Failed to load records:', err);
      }
    });
  }

  toggleLike(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    // Local toggle for now
    item.liked = !item.liked;
    this.items.update(items => [...items]); // Trigger signal update if needed, though mutating obj inside signal array sometimes works depending on change detection.
  }
}
