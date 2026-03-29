import { ChangeDetectionStrategy, Component, signal, computed, OnInit, inject } from '@angular/core';
import { RecordService } from '../services/record.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wantlist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="px-4 max-w-3xl mx-auto pt-8">
      <div class="mb-8 flex flex-col gap-2 px-2">
        <p class="text-primary font-headline font-bold tracking-widest uppercase text-[10px]">Curated Collection</p>
        <h2 class="text-2xl md:text-3xl font-headline font-extrabold tracking-tighter text-on-surface">{{items().length}} 件追踪中</h2>
        <div class="flex items-center gap-4 text-xs font-label text-on-surface-variant">
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span> {{availableCount()}} 可购</span>
          <span class="opacity-20">|</span>
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> {{waitCount()}} 等待中</span>
        </div>
      </div>

      <div class="flex flex-col">
        @for (item of items(); track item.id) {
          <a [routerLink]="['/product', item.id]" class="group relative flex gap-4 p-4 hover:bg-white/5 transition-all duration-300 border-b border-white/5 cursor-pointer">
            <div class="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg shadow-lg">
              <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              <div class="absolute top-1 left-1">
                @if (item.status === 'available') {
                  <span class="bg-primary-container text-on-primary-container px-1.5 py-0.5 text-[8px] font-bold rounded-sm uppercase">现货</span>
                } @else {
                  <span class="bg-outline-variant text-on-surface px-1.5 py-0.5 text-[8px] font-bold rounded-sm uppercase">等待中</span>
                }
              </div>
            </div>
            
            <div class="flex-1 flex flex-col min-w-0">
              <div class="flex justify-between items-start">
                <h3 class="font-headline font-bold text-base text-on-surface truncate">{{item.title}}</h3>
                <button (click)="toggleLike($event, item)" 
                        class="transition-colors"
                        [class.text-primary]="item.liked"
                        [class.text-on-surface]="!item.liked"
                        [class.opacity-30]="!item.liked"
                        [class.group-hover:text-primary]="!item.liked">
                  <span class="material-symbols-outlined text-[20px]" [style.font-variation-settings]="item.liked ? '&quot;FILL&quot; 1' : '&quot;FILL&quot; 0'">favorite</span>
                </button>
              </div>
              <p class="text-on-surface-variant text-xs mb-2">{{item.artist}}</p>
              <div class="flex gap-2 mb-auto">
                <span class="text-[10px] bg-white/5 text-on-surface/60 px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">{{item.format}}</span>
                <span class="text-[10px] bg-white/5 text-on-surface/60 px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">{{item.condition}}</span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="font-headline font-extrabold text-base md:text-lg" [class.text-primary-container]="item.status === 'available'" [class.text-on-surface]="item.status === 'wait'" [class.opacity-40]="item.status === 'wait'">¥{{item.price}}</span>
                @if (item.status === 'available') {
                  <button (click)="$event.preventDefault(); $event.stopPropagation()" class="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                    <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
                  </button>
                } @else {
                  <button (click)="$event.preventDefault(); $event.stopPropagation()" class="border border-outline-variant text-on-surface w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-[18px]">notifications_active</span>
                  </button>
                }
              </div>
            </div>
          </a>
        }
      </div>
    </div>
  `
})
export class WantlistComponent implements OnInit {
  private recordService = inject(RecordService);
  
  items = signal<any[]>([]);

  availableCount = computed(() => this.items().filter(i => i.status === 'available').length);
  waitCount = computed(() => this.items().filter(i => i.status === 'wait').length);

  ngOnInit() {
    this.recordService.getRecords().subscribe({
      next: (data) => {
        // Grab a slice of records to use as the wantlist and mock their availability status
        this.items.set(data.slice(data.length > 5 ? data.length - 4 : 0).map((item, index) => ({
          ...item,
          format: item.format,
          condition: `${item.media_grade} / ${item.sleeve_grade}`,
          image: item.image_url,
          status: index % 3 === 0 ? 'wait' : 'available',
          liked: true
        })));
      },
      error: (err) => {
        console.error('Failed to load wantlist records:', err);
      }
    });
  }

  toggleLike(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    item.liked = !item.liked;
    this.items.update(items => [...items]);
  }
}
