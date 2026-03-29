import { ChangeDetectionStrategy, Component } from '@angular/core';
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
        @for (item of items; track item.id) {
          <a [routerLink]="['/product', item.id]" class="group flex flex-col cursor-pointer">
            <div class="relative aspect-square overflow-hidden bg-surface-container-low mb-6 rounded-none">
              <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" referrerpolicy="no-referrer" />
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
export class HomeComponent {
  items = [
    { id: '1', title: 'Amnesiac', artist: 'Radiohead', price: '1,280', format: '黑胶', condition: 'NM (近乎新品)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTeQ6EDgEO-UvcnLlabt440OhXt-JmMaRBnhCo9dBvhnyFXXarSKt2Pn4LmrfemuRfjjRjl09erREg36YcEjkD0yXMaSbgqvpOjqckeoWqK2d3yzJM7n6e3Cqchaxbw0AZJfs9m2ZUbtdAfPEL7C86Ok7kTMc4EmblF9fDtRWO2SQi8_6VJsxQ9rdhNTrLWUlMuSI4YPr1mUZjsMPF-TtcdkuTIWdfgFnVNHVhX6WlJ44bwlzEMsfVCJjqlPpBTXFN26SdV5JmEe3i', liked: false },
    { id: '2', title: 'Unknown Pleasures', artist: 'Joy Division', price: '450', format: '磁带', condition: 'VG+ (极好)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTFppcWEiW8QzsWF1ya0gdu-7i-uON-MZ6RdJBSluzfXvfqxRxJl25uw-GVcMP4qrTKdRlIstxEDuLLz5DLfxdksMc4uSYnc-k6YRnOgNoNwtOmETeMO7mUmNy0ZMUpzJMDUMwAcO4WGd5rr2Ga-o0D6vdX5QYUDsdcBqE1_AzD8i3N9Ome4E9pltkGzrymiAGF3hfJoYY9LGLDGIUgZ26_l8TA8XCdN67RHPoU0wGwWsf4DKca6Qc9TqgbGM98SCZ919f9Ic2Sx5', liked: false },
    { id: '3', title: 'The Wall', artist: 'Pink Floyd', price: '180', format: 'CD', condition: 'M (全新)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlPnZW90i9sqd6y-J-W6IZFjRd9RY3SOl7jysCyHL3ZyiXIlYwht7012lAkD4F8V72AwPbmUO9gn9_MQl91a26mhEysAbOsDHIZqHnxFAEfTJ38mlCLaeVOc4-U7EUQB5Ngzz6CrVz0K0Ew2SUf-3WrNIpXQR0dmeWTRg9cnOwJwpRSbg2CQvlXo0v6Qj5GlIiB-T30j3LRteQZEhpOGzB18EGvcDiTAJhLc5kZNZT9jfkoOUZF-zHbCIxDjRyo1pYOSKSTuskH0g', liked: false },
    { id: '4', title: 'Kind of Blue', artist: 'Miles Davis', price: '2,400', format: '黑胶', condition: 'NM (近乎新品)', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2duI1hU6GRkF9afI15orOuJs0lBfn4aoZRpnnkkV07Di0AR8GJal9SVkF6PeB4TaShpmcKGd0ZaqnmzLG704ZZZRbtY3s65LBU0Vzz-H7bPZG-F3t_Jl6lv1lVvgmd055nK4LuR-SRTYHp3kLQZdFSxEjnx-NBjXX0nVC7kh38is2upTd02f4p61piUhsDcwaavqhi_ZIMYNtaaic6ZEqO8yurgrExxqC3VpWEZHRTv2yNMCdhHHRj1UrBPtqKsw8x1NT1s0d4VTG', liked: false },
  ];

  toggleLike(event: Event, item: any) {
    event.preventDefault();
    event.stopPropagation();
    item.liked = !item.liked;
  }
}
