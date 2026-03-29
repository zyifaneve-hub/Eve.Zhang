import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Product {
  id: string;
  title: string;
  artist: string;
  price: number;
  format: 'Vinyl' | 'CD' | 'Cassette';
  condition: 'M' | 'NM' | 'VG+' | 'VG' | 'G';
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
        <button (click)="isFilterOpen.set(true)" class="flex items-center gap-2 text-on-surface/60 hover:text-primary transition-colors shrink-0 py-2 px-4 rounded-full border border-outline-variant hover:bg-surface-container">
          <span class="text-xs uppercase font-bold tracking-widest">筛选</span>
          <span class="material-symbols-outlined text-lg">filter_list</span>
          @if (activeFilterCount() > 0) {
            <span class="w-2 h-2 bg-primary rounded-full"></span>
          }
        </button>
      </section>

      <!-- Search Results -->
      <section class="mt-4">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          @for (item of filteredProducts(); track item.id) {
            <a [routerLink]="['/product', item.id]" class="group flex flex-col cursor-pointer">
              <div class="relative aspect-square overflow-hidden bg-surface-container-low mb-4 rounded-lg">
                <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" referrerpolicy="no-referrer" />
                <div class="absolute top-2 right-2 bg-primary text-on-primary text-[10px] px-2 py-1 font-bold tracking-widest">[{{item.format}}]</div>
                <div class="absolute bottom-2 left-2 bg-surface/80 backdrop-blur-md px-2 py-1 text-[10px] text-primary border border-primary/20">{{item.condition}}</div>
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
export class CrateComponent {
  isFilterOpen = signal(false);

  searchQuery = signal('');
  selectedFormat = signal<string | null>(null);
  selectedCondition = signal<string | null>(null);

  formats = [
    { value: 'Vinyl', label: '黑胶 (Vinyl)' },
    { value: 'CD', label: 'CD' },
    { value: 'Cassette', label: '磁带 (Cassette)' }
  ];
  conditions = ['M', 'NM', 'VG+', 'VG', 'G'];

  products = signal<Product[]>([
    { id: '1', title: 'Amnesiac', artist: 'Radiohead', price: 1280, format: 'Vinyl', condition: 'NM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTeQ6EDgEO-UvcnLlabt440OhXt-JmMaRBnhCo9dBvhnyFXXarSKt2Pn4LmrfemuRfjjRjl09erREg36YcEjkD0yXMaSbgqvpOjqckeoWqK2d3yzJM7n6e3Cqchaxbw0AZJfs9m2ZUbtdAfPEL7C86Ok7kTMc4EmblF9fDtRWO2SQi8_6VJsxQ9rdhNTrLWUlMuSI4YPr1mUZjsMPF-TtcdkuTIWdfgFnVNHVhX6WlJ44bwlzEMsfVCJjqlPpBTXFN26SdV5JmEe3i', purchasedDate: '2025-10-12' },
    { id: '2', title: 'Unknown Pleasures', artist: 'Joy Division', price: 450, format: 'Cassette', condition: 'VG+', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTFppcWEiW8QzsWF1ya0gdu-7i-uON-MZ6RdJBSluzfXvfqxRxJl25uw-GVcMP4qrTKdRlIstxEDuLLz5DLfxdksMc4uSYnc-k6YRnOgNoNwtOmETeMO7mUmNy0ZMUpzJMDUMwAcO4WGd5rr2Ga-o0D6vdX5QYUDsdcBqE1_AzD8i3N9Ome4E9pltkGzrymiAGF3hfJoYY9LGLDGIUgZ26_l8TA8XCdN67RHPoU0wGwWsf4DKca6Qc9TqgbGM98SCZ919f9Ic2Sx5', purchasedDate: '2025-09-05' },
    { id: '3', title: 'The Wall', artist: 'Pink Floyd', price: 180, format: 'CD', condition: 'M', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlPnZW90i9sqd6y-J-W6IZFjRd9RY3SOl7jysCyHL3ZyiXIlYwht7012lAkD4F8V72AwPbmUO9gn9_MQl91a26mhEysAbOsDHIZqHnxFAEfTJ38mlCLaeVOc4-U7EUQB5Ngzz6CrVz0K0Ew2SUf-3WrNIpXQR0dmeWTRg9cnOwJwpRSbg2CQvlXo0v6Qj5GlIiB-T30j3LRteQZEhpOGzB18EGvcDiTAJhLc5kZNZT9jfkoOUZF-zHbCIxDjRyo1pYOSKSTuskH0g', purchasedDate: '2025-08-22' },
    { id: '4', title: 'Kind of Blue', artist: 'Miles Davis', price: 2400, format: 'Vinyl', condition: 'NM', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2duI1hU6GRkF9afI15orOuJs0lBfn4aoZRpnnkkV07Di0AR8GJal9SVkF6PeB4TaShpmcKGd0ZaqnmzLG704ZZZRbtY3s65LBU0Vzz-H7bPZG-F3t_Jl6lv1lVvgmd055nK4LuR-SRTYHp3kLQZdFSxEjnx-NBjXX0nVC7kh38is2upTd02f4p61piUhsDcwaavqhi_ZIMYNtaaic6ZEqO8yurgrExxqC3VpWEZHRTv2yNMCdhHHRj1UrBPtqKsw8x1NT1s0d4VTG', purchasedDate: '2025-07-15' },
    { id: '5', title: 'Random Access Memories', artist: 'Daft Punk', price: 315, format: 'Vinyl', condition: 'VG+', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwvSqg8xEb6bipZmGJpzr7vg1VbIbl9x5WVNcPrPqcv4G8WWFemnrarrGBILFNUk-0uCNc1190O1Bws-e-p4R7Difvy_09jRcZQtRv5FOyEw1CsWst4VMTb9BK1Moa_SwNFByfyqQbgrOnPhGYLWev4LQ3exd197DFcX_IlMQKBHDeLhgfkPcbDAYzuy3Ybg6jqbqqzyHTxmfTkq8lw9m9_XqLnjk5_tExXDBBP_1gtO1-XPPfMLdG9TDVJYWz2Z7-yXZnau5UD1t1', purchasedDate: '2025-06-30' },
    { id: '6', title: 'A Love Supreme', artist: 'John Coltrane', price: 580, format: 'Vinyl', condition: 'M', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7QHYX5Rou2YKKZphi474hbUlj7VHVz1t57Oqw0I0_aTWnKWMtsFTFO2nCnrRU38YHtnvxwgoU5lqWv3eMpa1LExjNnBC8yDenDfd3BBYutQX7h42mSTu0vDYgs7Z9uRgOBPzkb5JIJvOWjtpAo6Y54Pb7JBAic4gbSAKck7dbTLZj47jBjDtnp1DIIetYPvLkRLQTojjMIIPcR-1Uvyz-4W0g-dMAPso-OwymQkxzLLqmgVCt5qE4ESS6twVInE5CydBiYHSOvwyE', purchasedDate: '2025-05-18' },
  ]);

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
      if (this.selectedFormat() && p.format !== this.selectedFormat()) {
        return false;
      }
      // Condition
      if (this.selectedCondition() && p.condition !== this.selectedCondition()) {
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
}
