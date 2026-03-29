import { ChangeDetectionStrategy, Component, signal, computed, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecordService } from '../services/record.service';

interface Product {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: string;
  condition: string;
  image: string;
  purchasedDate: string;
}

@Component({
  selector: 'app-crate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="px-6 max-w-7xl mx-auto pt-8 pb-24">
      <div class="mb-12 flex items-center gap-4">
        <a routerLink="/profile" class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </a>
        <div>
          <h1 class="font-headline text-3xl md:text-4xl font-black tracking-tight text-on-surface uppercase">我的虚拟唱片箱</h1>
          <p class="text-on-surface/50 font-body text-sm mt-1">已购买的 {{products().length}} 张精品黑胶唱片</p>
        </div>
      </div>

      <section class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md group">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 group-focus-within:text-primary transition-colors">
            <span class="material-symbols-outlined">search</span>
          </span>
          <input 
            type="text" 
            placeholder="在唱片箱中搜索..." 
            class="w-full bg-surface-container-low border border-outline-variant rounded-full focus:border-primary focus:ring-0 text-sm py-3 pl-12 pr-4 transition-all placeholder:text-on-surface/30 outline-none"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
          />
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button (click)="isFilterOpen.set(true)" class="flex items-center gap-2 text-on-surface/60 hover:text-primary transition-colors py-2 px-4 rounded-full border border-outline-variant hover:bg-surface-container">
            <span class="text-xs uppercase font-bold tracking-widest">筛选</span>
            <span class="material-symbols-outlined text-lg">filter_list</span>
            @if (activeFilterCount() > 0) {
              <span class="w-2 h-2 bg-primary rounded-full"></span>
            }
          </button>
          <button (click)="toggleSelectionMode()" class="flex items-center gap-2 text-on-surface/60 hover:text-primary transition-colors py-2 px-4 rounded-full border border-outline-variant hover:bg-surface-container" [class.bg-primary-container]="isSelectionMode()" [class.text-on-primary-container]="isSelectionMode()" [class.border-primary]="isSelectionMode()">
            <span class="text-xs uppercase font-bold tracking-widest">{{ isSelectionMode() ? '完成' : '管理' }}</span>
            <span class="material-symbols-outlined text-lg">{{ isSelectionMode() ? 'check' : 'checklist' }}</span>
          </button>
        </div>
      </section>

      <!-- Search Results -->
      <section class="mt-4">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          @for (item of filteredProducts(); track item.id) {
            <a [routerLink]="isSelectionMode() ? null : ['/product', item.id]" 
               (click)="isSelectionMode() ? toggleSelection(item.id, $event) : null"
               class="group flex flex-col cursor-pointer relative transition-opacity"
               [class.opacity-40]="isSelectionMode() && !selectedIds().has(item.id)">
              
              @if (isSelectionMode()) {
                <div class="absolute top-2 left-2 z-20 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                     [class.bg-primary]="selectedIds().has(item.id)"
                     [class.border-primary]="selectedIds().has(item.id)"
                     [class.border-white]="!selectedIds().has(item.id)"
                     [class.bg-black/20]="!selectedIds().has(item.id)">
                  @if (selectedIds().has(item.id)) {
                    <span class="material-symbols-outlined text-on-primary text-sm font-bold">check</span>
                  }
                </div>
              }

              <div class="relative aspect-square overflow-hidden bg-surface-container-low mb-4 rounded-lg">
                <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover transition-transform duration-300 hover:scale-110" referrerpolicy="no-referrer" />
                <div class="absolute top-2 right-2 bg-primary text-on-primary text-[10px] px-2 py-1 font-bold tracking-widest pointer-events-none">[{{item.format}}]</div>
                <div class="absolute bottom-2 left-2 bg-surface/80 backdrop-blur-md px-2 py-1 text-[10px] text-primary border border-primary/20 pointer-events-none">{{item.condition}}</div>
              </div>
              <div class="space-y-1">
                <h4 class="font-headline text-sm md:text-base font-bold group-hover:text-primary transition-colors truncate">{{item.title}}</h4>
                <p class="font-body text-xs text-on-surface/50 truncate">{{item.artist}}</p>
                <div class="flex justify-between items-center pt-2">
                  <span class="font-headline font-extrabold text-sm text-on-surface/60">购于 {{item.purchasedDate}}</span>
                  <span class="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors">album</span>
                </div>
              </div>
            </a>
          }
        </div>
        
        @if (filteredProducts().length === 0) {
          <div class="py-20 text-center text-on-surface/50">
            <span class="material-symbols-outlined text-4xl mb-4 opacity-50">search_off</span>
            <p>没有找到符合条件的唱片</p>
            <button (click)="resetFilters()" class="mt-4 px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors text-sm">清除筛选条件</button>
          </div>
        }
      </section>
    </div>

    <!-- Batch Action Bar -->
    @if (isSelectionMode()) {
      <div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface-container-high border border-outline-variant shadow-2xl rounded-full px-6 py-4 flex items-center gap-6 z-40 animate-in slide-in-from-bottom-10">
        <span class="font-headline font-bold text-sm whitespace-nowrap">已选择 {{selectedIds().size}} 项</span>
        <div class="w-px h-4 bg-outline-variant"></div>
        <button (click)="sellSelected()" [disabled]="selectedIds().size === 0" class="text-sm font-bold text-primary disabled:opacity-50 transition-opacity flex items-center gap-1 whitespace-nowrap">
          <span class="material-symbols-outlined text-lg">sell</span>
          出售
        </button>
        <button (click)="deleteSelected()" [disabled]="selectedIds().size === 0" class="text-sm font-bold text-red-500 disabled:opacity-50 transition-opacity flex items-center gap-1 whitespace-nowrap">
          <span class="material-symbols-outlined text-lg">delete</span>
          删除
        </button>
      </div>
    }

    <!-- Toast Notification -->
    @if (toastMessage()) {
      <div class="fixed top-4 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-6 py-3 rounded-full shadow-lg z-50 animate-in fade-in slide-in-from-top-4 font-body text-sm">
        {{toastMessage()}}
      </div>
    }

    <!-- Filter Drawer -->
    @if (isFilterOpen()) {
      <div class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="isFilterOpen.set(false)"></div>
        
        <!-- Drawer -->
        <div class="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div class="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h2 class="text-xl font-headline font-bold">筛选条件</h2>
            <button (click)="isFilterOpen.set(false)" class="p-2 hover:bg-surface-container rounded-full transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="p-6 flex-1 overflow-y-auto space-y-8">
            <!-- Format -->
            <div>
              <h3 class="text-sm font-bold tracking-widest uppercase text-on-surface/60 mb-4">格式 (Format)</h3>
              <div class="flex flex-wrap gap-3">
                @for (fmt of formats; track fmt.value) {
                  <button 
                    (click)="selectedFormat.set(selectedFormat() === fmt.value ? null : fmt.value)"
                    class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                    [class.bg-primary-container]="selectedFormat() === fmt.value"
                    [class.text-on-primary-container]="selectedFormat() === fmt.value"
                    [class.border-primary]="selectedFormat() === fmt.value"
                    [class.border-outline-variant]="selectedFormat() !== fmt.value"
                    [class.text-on-surface]="selectedFormat() !== fmt.value"
                    [class.hover:bg-surface-container]="selectedFormat() !== fmt.value"
                  >
                    {{fmt.label}}
                  </button>
                }
              </div>
            </div>

            <!-- Condition -->
            <div>
              <h3 class="text-sm font-bold tracking-widest uppercase text-on-surface/60 mb-4">品相 (Condition)</h3>
              <div class="flex flex-wrap gap-3">
                @for (cond of conditions; track cond) {
                  <button 
                    (click)="selectedCondition.set(selectedCondition() === cond ? null : cond)"
                    class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
                    [class.bg-primary-container]="selectedCondition() === cond"
                    [class.text-on-primary-container]="selectedCondition() === cond"
                    [class.border-primary]="selectedCondition() === cond"
                    [class.border-outline-variant]="selectedCondition() !== cond"
                    [class.text-on-surface]="selectedCondition() !== cond"
                    [class.hover:bg-surface-container]="selectedCondition() !== cond"
                  >
                    {{cond}}
                  </button>
                }
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-outline-variant/20 flex gap-4 bg-surface">
            <button (click)="resetFilters()" class="flex-1 py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container transition-colors">
              重置
            </button>
            <button (click)="isFilterOpen.set(false)" class="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              查看结果 ({{filteredProducts().length}})
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class CrateComponent implements OnInit {
  private recordService = inject(RecordService);

  isFilterOpen = signal(false);
  isSelectionMode = signal(false);
  selectedIds = signal<Set<string>>(new Set());
  toastMessage = signal<string | null>(null);

  searchQuery = signal('');
  selectedFormat = signal<string | null>(null);
  selectedCondition = signal<string | null>(null);

  formats = [
    { value: 'Vinyl', label: '黑胶 (Vinyl)' },
    { value: 'CD', label: 'CD' },
    { value: 'Cassette', label: '磁带 (Cassette)' }
  ];
  conditions = ['M', 'NM', 'VG+', 'VG', 'G'];

  products = signal<Product[]>([]);

  ngOnInit() {
    this.recordService.getRecords().subscribe({
      next: (data) => {
        // Mocking purchasedDate since it's not in the DB schema for records, just assigning a fake one
        this.products.set(data.map((item, index) => ({
          ...item,
          format: item.format,
          condition: `${item.media_grade} / ${item.sleeve_grade}`,
          image: item.image_url,
          purchasedDate: `2025-0${(index % 9) + 1}-15`
        })));
      },
      error: (err) => {
        console.error('Failed to load crate records:', err);
      }
    });
  }

  filteredProducts = computed(() => {
    return this.products().filter(p => {
      // Search query
      if (this.searchQuery()) {
        const query = this.searchQuery().toLowerCase();
        if (!p.title.toLowerCase().includes(query) && !p.artist.toLowerCase().includes(query)) {
          return false;
        }
      }
      // Format
      if (this.selectedFormat()) {
        const isVinyl = this.selectedFormat() === 'Vinyl';
        const itemFormatUpper = p.format ? p.format.toUpperCase() : '';
        if (isVinyl && !itemFormatUpper.includes('LP')) {
          return false;
        } else if (!isVinyl && !itemFormatUpper.includes(this.selectedFormat()!.toUpperCase())) {
          return false;
        }
      }
      // Condition
      if (this.selectedCondition() && p.condition && !p.condition.includes(this.selectedCondition()!)) {
        return false;
      }
      return true;
    });
  });

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedFormat()) count++;
    if (this.selectedCondition()) count++;
    return count;
  });

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedFormat.set(null);
    this.selectedCondition.set(null);
  }

  toggleSelectionMode() {
    this.isSelectionMode.set(!this.isSelectionMode());
    this.selectedIds.set(new Set());
  }

  toggleSelection(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
  }

  deleteSelected() {
    const selected = this.selectedIds();
    const count = selected.size;
    this.products.update(prods => prods.filter(p => !selected.has(p.id)));
    this.toggleSelectionMode();
    this.showToast(`已成功删除 ${count} 张唱片`);
  }

  sellSelected() {
    const count = this.selectedIds().size;
    this.toggleSelectionMode();
    this.showToast(`已将 ${count} 张唱片加入出售列表`);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }
}
